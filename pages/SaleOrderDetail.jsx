import React, { useEffect, useState } from "react";
import OrderDetailPage from "./OrderDetailPage";
import { useParams } from "react-router-dom";
import { getSaleOrders } from "../services/financeService";

export default function SaleOrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getSaleOrders({}).then(orders => setOrder(orders.find(o => String(o.id) === String(orderId))));
  }, [orderId]);

  if (!order) return null;

  return <OrderDetailPage order={order} type="sale" />;
}