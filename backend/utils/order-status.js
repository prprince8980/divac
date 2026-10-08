function getCustomerOrderStatus(order) {
  const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
  const latestHistoryStatus = history.length ? history[history.length - 1]?.status : '';
  const status = latestHistoryStatus || order.status || 'pending';

  if (order.isCancelled || order.status === 'cancelled' || status === 'cancelled') {
    return 'cancelled';
  }
  if (status === 'processing' || status === 'accepted' || (!latestHistoryStatus && order.isAccepted)) {
    return 'accepted';
  }
  return status;
}

module.exports = { getCustomerOrderStatus };
