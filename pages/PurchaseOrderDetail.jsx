import React, { useEffect, useState } from "react";
import OrderDetailPage from "./OrderDetailPage";
import { useParams } from "react-router-dom";
import { getPurchaseOrders } from "../services/financeService";

export default function PurchaseOrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getPurchaseOrders({}).then(orders => setOrder(orders.find(o => String(o.id) === String(orderId))));
  }, [orderId]);

  if (!order) return null;

  return <OrderDetailPage order={order} type="purchase" />;
}