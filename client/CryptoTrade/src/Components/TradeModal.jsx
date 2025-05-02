import React from 'react';

const TradeModal = ({ isOpen, onClose, onSuccess, symbol }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const tradeData = {
      symbol: symbol,
      quantity: parseFloat(form.quantity.value),
      entry: parseFloat(form.entry.value),
      sl: parseFloat(form.sl.value),
      tp: parseFloat(form.tp.value),
      type: form.type.value,
    };

    console.log('Trade Submitted:', tradeData);
    onSuccess?.(); // trigger toast
    onClose();     // close modal
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-800 text-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Place Trade - {symbol.toUpperCase()}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              step="any"
              required
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Entry Price</label>
            <input
              type="number"
              name="entry"
              step="any"
              required
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Stop Loss (SL)</label>
            <input
              type="number"
              name="sl"
              step="any"
              required
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Take Profit (TP)</label>
            <input
              type="number"
              name="tp"
              step="any"
              required
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Type</label>
            <select
              name="type"
              required
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeModal;
