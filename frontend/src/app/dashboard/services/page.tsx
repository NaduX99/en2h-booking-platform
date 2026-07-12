'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { servicesApi } from '@/lib/api/services.api';
import { ServiceItem } from '@/types/service.types';
import { serviceSchema, ServiceFormData } from '@/lib/validation/service.schema';
import { Input } from '@/components/common/Input';
import { TextArea } from '@/components/common/TextArea';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { SearchInput } from '@/components/common/SearchInput';
import { Pagination } from '@/components/common/Pagination';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { useDebounce } from '@/hooks/useDebounce';
import { getErrorMessage } from '@/lib/api/api-error';
import { formatCurrency } from '@/lib/formatters/currency';
import { formatDuration } from '@/lib/formatters/duration';
import styles from './page.module.css';

const LIMIT = 10;

export default function DashboardServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const debouncedSearch = useDebounce(search, 400);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { isActive: true },
  });

  const load = async (p: number, s: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await servicesApi.getAll({ page: p, limit: LIMIT, search: s || undefined });
      setServices(res.data ?? []);
      setTotal(res.meta?.total ?? 0);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      setPage(1);
    });
  }, [debouncedSearch]);

  useEffect(() => {
    Promise.resolve().then(() => {
      void load(page, debouncedSearch);
    });
  }, [page, debouncedSearch]);

  const openCreate = () => {
    setEditing(null);
    reset({ title: '', description: '', duration: 60, price: 0, isActive: true });
    setFormOpen(true);
  };

  const openEdit = (svc: ServiceItem) => {
    setEditing(svc);
    reset({
      title: svc.title,
      description: svc.description,
      duration: svc.duration,
      price: Number(svc.price),
      isActive: svc.isActive,
    });
    setFormOpen(true);
  };

  const onSubmit = async (data: ServiceFormData) => {
    setSaving(true);
    try {
      if (editing) {
        await servicesApi.update(editing.id, data);
        toast.success('Service updated successfully!');
      } else {
        await servicesApi.create(data);
        toast.success('Service created successfully!');
      }
      setFormOpen(false);
      void load(page, debouncedSearch);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await servicesApi.remove(deleteTarget.id);
      toast.success(`"${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      void load(1, debouncedSearch);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className="aether-heading-lg">Services</h1>
          <p className="aether-body">Create and manage available services.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={openCreate}>New Service</Button>
      </div>

      <div className={styles.controls}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search services..." />
      </div>

      {loading && <div><Skeleton height={48} count={5} className={styles.skeletonRow} /></div>}
      {!loading && error && <ErrorState message={error} onRetry={() => void load(page, debouncedSearch)} />}

      {!loading && !error && services.length === 0 && (
        <EmptyState title="No services yet" description="Create your first service to get started." action={<Button variant="primary" leftIcon={<Plus size={16} />} onClick={openCreate}>New Service</Button>} />
      )}

      {!loading && !error && services.length > 0 && (
        <>
          <div className={`aether-card ${styles.tableCard}`}>
            <div className="table-scroll-wrapper">
              <table className="aether-table" aria-label="Services list">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((svc) => (
                    <tr key={svc.id}>
                      <td>
                        <p style={{ fontWeight: 500 }}>{svc.title}</p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{svc.description.slice(0, 60)}…</p>
                      </td>
                      <td style={{ fontFamily: 'var(--font-label)', fontSize: '12px' }}>{formatDuration(svc.duration)}</td>
                      <td style={{ fontFamily: 'var(--font-label)', fontSize: '12px' }}>{formatCurrency(svc.price)}</td>
                      <td>
                        <span className={`badge ${svc.isActive ? 'badge-active' : 'badge-inactive'}`}>
                          {svc.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.rowActions}>
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(svc)} aria-label={`Edit ${svc.title}`}>
                            <Pencil size={14} />
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(svc)} aria-label={`Delete ${svc.title}`}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Create / Edit modal */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Service' : 'New Service'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <Input label="Title" required error={errors.title?.message} {...register('title')} />
          <TextArea label="Description" required rows={3} error={errors.description?.message} {...register('description')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Input label="Duration (min)" type="number" required error={errors.duration?.message} {...register('duration', { valueAsNumber: true })} />
            <Input label="Price ($)" type="number" step="0.01" required error={errors.price?.message} {...register('price', { valueAsNumber: true })} />
          </div>
          <div className="form-field">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer', textTransform: 'none', fontSize: '0.9375rem', fontFamily: 'var(--font-body)' }}>
              <input type="checkbox" {...register('isActive')} style={{ width: 16, height: 16, accentColor: 'white', cursor: 'pointer' }} />
              Active (visible to customers)
            </label>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button variant="secondary" type="button" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" isLoading={saving}>{editing ? 'Save Changes' : 'Create Service'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This action cannot be undone. Services with existing bookings may be blocked from deletion."
        confirmLabel="Delete"
        isLoading={deleting}
      />
    </div>
  );
}
