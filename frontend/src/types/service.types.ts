export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number | string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateServiceInput {
  title: string;
  description: string;
  duration: number;
  price: number;
  isActive: boolean;
}

export type UpdateServiceInput = Partial<CreateServiceInput>;

export interface ServiceQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}
