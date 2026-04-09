import { IsString, Length, Matches } from 'class-validator';

export class SearchStockDto {
  @IsString()
  @Length(1, 10)
  @Matches(/^[A-Z0-9\-\.]+$/i, {
    message: 'Symbol must contain only letters, numbers, hyphens, and dots'
  })
  symbol: string;
}