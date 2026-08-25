import { useState, useCallback } from 'react';
import { getVendorById, calculateReorderQty } from '../data/inventory';

function buildFallbackRecommendation(item) {
  const vendor = getVendorById(item.vendorId);
  const reorderQty = calculateReorderQty(item.rop, item.currentQty);
  const coverageDays = Math.floor((item.currentQty / item.rop) * 30);

  let urgency = 'Low';
  let action = 'Monitor stock levels.';
  if (coverageDays <= 5) {
    urgency = 'Critical';
    action = `Immediate reorder recommended. Only ${coverageDays} days of coverage remaining. Ship directly to ${item.storageLocation}.`;
  } else if (coverageDays <= 10) {
    urgency = 'High';
    action = `Reorder within 2 business days. Current coverage: ${coverageDays} days. Consider expedited shipping.`;
  } else if (coverageDays <= 15) {
    urgency = 'Medium';
    action = `Schedule reorder within the week. ${coverageDays} days of coverage remaining.`;
  } else {
    action = `Stock is declining but adequate. Schedule next review in 2 weeks.`;
  }

  return {
    recommendation: `${urgency} urgency reorder for ${item.id} (${item.description}). ${action} Recommended quantity: ${reorderQty} units via ${vendor?.name || 'primary vendor'} (lead time: ${vendor?.leadTimeDays || 'N/A'} days). Estimated cost: ₹${(reorderQty * item.unitPrice).toLocaleString()}.`,
    urgency,
    coverageDays,
    recommendedQty: reorderQty,
    estimatedCost: reorderQty * item.unitPrice,
  };
}

export function useAiRecommendation() {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const getRecommendation = useCallback(async (item) => {
    setLoading(true);

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      await new Promise(r => setTimeout(r, 600));
      const result = buildFallbackRecommendation(item);
      setRecommendation(result);
      setLoading(false);
      return result;
    }

    try {
      const prompt = `You are an SAP Materials Management (MM) assistant for Bright Motors.
Analyze this brake-pad inventory item and provide a reorder recommendation.
Item: ${item.id} - ${item.description}
Category: ${item.category}
ROP: ${item.rop}
Current Qty: ${item.currentQty}
Reorder Qty formula: (ROP × 1.2) − Current Qty = ${calculateReorderQty(item.rop, item.currentQty)}
Unit Price: ₹${item.unitPrice}
Plant: ${item.plant}
Storage Location: ${item.storageLocation}
Vendor Lead Time: ${getVendorById(item.vendorId)?.leadTimeDays || 'N/A'} days

Return a JSON object with keys: recommendation (string), urgency (Critical/High/Medium/Low), coverageDays (number), recommendedQty (number), estimatedCost (number).
Keep recommendation under 200 words. Be specific and actionable.`;

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 300,
        }),
      });

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      const content = data.choices[0].message.content;
      const parsed = JSON.parse(content);
      setRecommendation(parsed);
      setLoading(false);
      return parsed;
    } catch {
      const result = buildFallbackRecommendation(item);
      setRecommendation(result);
      setLoading(false);
      return result;
    }
  }, []);

  return { recommendation, loading, getRecommendation, setRecommendation };
}
