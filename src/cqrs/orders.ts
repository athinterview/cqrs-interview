import { Command} from './command';

export type OrderPlaceProduct = {
  id: string;
  amount: number;
}

export type OrderPlacePayload = {
  customerId: string;
  products: OrderPlaceProduct[];
}

export type OrderPlaceResult = {
  id: string;
}

export type OrderPlaceCommand = Command<'order.place', OrderPlacePayload, OrderPlaceResult>;

export function orderPlaceCommand(payload: OrderPlacePayload): OrderPlaceCommand {
  return {
    type: 'order.place',
    payload
  }
}
