export interface CreateSpecialistDto {
  bio?: string;
  specialization: string;
  avatarUrl?: string;
}

export interface UpdateSpecialistDto {
  bio?: string;
  specialization?: string;
  avatarUrl?: string;
}
