import { createContext, useContext, useReducer, useCallback, useState } from 'react';
import { INITIAL_INVENTORY, generatePrNumber, getVendorById } from '../data/inventory';

const StoreContext = createContext(null);

const ACTIONS = {
  SUBMIT_REORDER: 'SUBMIT_REORDER',
  UPDATE_QTY: 'UPDATE_QTY',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SUBMIT_REORDER: {
      const { itemId, reorderQty, vendorId, notes } = action.payload;
      const item = state.inventory.find(i => i.id === itemId);
      if (!item) return state;

      const pr = {
        id: generatePrNumber(),
        itemId,
        description: item.description,
        reorderQty,
        vendorId,
        vendorName: getVendorById(vendorId)?.name || 'Unknown',
        notes,
        status: 'Submitted',
        submittedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + (getVendorById(vendorId)?.leadTimeDays || 7) * 86400000).toISOString().split('T')[0],
      };

      return {
        ...state,
        inventory: state.inventory.map(i =>
          i.id === itemId ? { ...i, currentQty: i.currentQty + reorderQty } : i
        ),
        purchaseRequests: [pr, ...state.purchaseRequests],
      };
    }
    case ACTIONS.UPDATE_QTY: {
      const { itemId, qty } = action.payload;
      return {
        ...state,
        inventory: state.inventory.map(i =>
          i.id === itemId ? { ...i, currentQty: qty } : i
        ),
      };
    }
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    inventory: INITIAL_INVENTORY,
    purchaseRequests: [],
  });

  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const submitReorder = useCallback((itemId, reorderQty, vendorId, notes) => {
    const qty = parseInt(reorderQty, 10);
    if (isNaN(qty) || qty <= 0) {
      addToast({ type: 'error', message: 'Reorder quantity must be a positive number.' });
      return false;
    }
    try {
      dispatch({ type: ACTIONS.SUBMIT_REORDER, payload: { itemId, reorderQty: qty, vendorId, notes } });
      addToast({ type: 'success', message: `Purchase request submitted for ${itemId}. Quantity: ${qty} units.` });
      return true;
    } catch {
      addToast({ type: 'error', message: 'Failed to submit reorder. Please try again.' });
      return false;
    }
  }, [addToast]);

  const updateQty = useCallback((itemId, newQty) => {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty < 0) {
      addToast({ type: 'error', message: 'Stock quantity must be a non-negative number.' });
      return false;
    }
    dispatch({ type: ACTIONS.UPDATE_QTY, payload: { itemId, qty } });
    addToast({ type: 'success', message: `Stock for ${itemId} updated to ${qty} units.` });
    return true;
  }, [addToast]);

  const kpis = {
    totalSku: state.inventory.length,
    belowRop: state.inventory.filter(i => i.currentQty < i.rop).length,
    healthyStock: state.inventory.filter(i => i.currentQty >= i.rop).length,
    totalStock: state.inventory.reduce((sum, i) => sum + i.currentQty, 0),
    activePr: state.purchaseRequests.filter(p => p.status === 'Submitted').length,
    totalInventoryValue: state.inventory.reduce((sum, i) => sum + i.currentQty * i.unitPrice, 0),
  };

  const value = {
    state,
    kpis,
    loading,
    setLoading,
    toasts,
    addToast,
    removeToast,
    submitReorder,
    updateQty,
    dispatch,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
