import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  it('maps HttpException responses to the documented error envelope', () => {
    const filter = new HttpExceptionFilter();
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const request = { url: '/api/v1/test', method: 'GET' };
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
        getRequest: () => request,
      }),
    } as never;

    filter.catch(
      new BadRequestException({
        message: 'Validation failed',
        error: 'Bad Request',
      }),
      host,
    );

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        error: 'Bad Request',
        path: '/api/v1/test',
        method: 'GET',
        timestamp: expect.any(String),
      }),
    );
  });

  it('falls back to the exception message when response payload has no message', () => {
    const filter = new HttpExceptionFilter();
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const request = { url: '/api/v1/health', method: 'GET' };
    const host = {
      switchToHttp: () => ({
        getResponse: () => ({ status }),
        getRequest: () => request,
      }),
    } as never;

    filter.catch(new HttpException('Nope', 418), host);

    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 418,
        message: 'Nope',
        path: '/api/v1/health',
        method: 'GET',
      }),
    );
  });
});
