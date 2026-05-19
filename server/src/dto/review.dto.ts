export interface CreateReviewDto {
  specialistId: number;
  appointmentId: number;
  rating: number;
  comment?: string;
}
