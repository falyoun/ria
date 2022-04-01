import { PartialType } from '@nestjs/swagger';
import { RequestNewReceipt } from './create-receipt.dto';

export class UpdateReceiptDto extends PartialType(RequestNewReceipt) {}
