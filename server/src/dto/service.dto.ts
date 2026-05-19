export interface CreateServiceDto {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  price?: number;
  durationMinutes?: number;
}
