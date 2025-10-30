import axiosInstance from "../axiosConfig";

// ========== INVENTORY CRUD ==========

/**
 * Get all inventories with filters and pagination
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise}
 */
export const getAllInventories = (params = {}) => {
  return axiosInstance.get("/inventories", { params });
};

/**
 * Get single inventory by ID
 * @param {number} id - Inventory ID
 * @returns {Promise}
 */
export const getInventoryById = (id) => {
  return axiosInstance.get(`/inventories/${id}`);
};

/**
 * Create new inventory item
 * @param {Object} data - Inventory data
 * @returns {Promise}
 */
export const createInventory = (data) => {
  return axiosInstance.post("/inventories", data);
};

/**
 * Update inventory item
 * @param {number} id - Inventory ID
 * @param {Object} data - Updated inventory data
 * @returns {Promise}
 */
export const updateInventory = (id, data) => {
  return axiosInstance.put(`/inventories/${id}`, data);
};

/**
 * Delete inventory item (soft delete)
 * @param {number} id - Inventory ID
 * @returns {Promise}
 */
export const deleteInventory = (id) => {
  return axiosInstance.delete(`/inventories/${id}`);
};

// ========== VARIATION CRUD ==========

/**
 * Get all variations for an inventory item
 * @param {number} inventoryId - Inventory ID
 * @returns {Promise}
 */
export const getVariationsByInventory = (inventoryId) => {
  return axiosInstance.get(`/inventory-variations/inventory/${inventoryId}`);
};

/**
 * Get single variation by ID
 * @param {number} id - Variation ID
 * @returns {Promise}
 */
export const getVariationById = (id) => {
  return axiosInstance.get(`/inventory-variations/${id}`);
};

/**
 * Create new variation
 * @param {Object} data - Variation data
 * @returns {Promise}
 */
export const createVariation = (data) => {
  return axiosInstance.post("/inventory-variations", data);
};

/**
 * Update variation
 * @param {number} id - Variation ID
 * @param {Object} data - Updated variation data
 * @returns {Promise}
 */
export const updateVariation = (id, data) => {
  return axiosInstance.put(`/inventory-variations/${id}`, data);
};

/**
 * Delete variation (soft delete)
 * @param {number} id - Variation ID
 * @returns {Promise}
 */
export const deleteVariation = (id) => {
  return axiosInstance.delete(`/inventory-variations/${id}`);
};

// ========== STOCK MANAGEMENT ==========

/**
 * Add stock to inventory
 * @param {number} inventoryId - Inventory ID
 * @param {Object} data - Stock data (variation_id, batch_id, quantity, note, related_invoice_id)
 * @returns {Promise}
 */
export const addStock = (inventoryId, data) => {
  return axiosInstance.post(`/inventory/${inventoryId}/stock/add`, data);
};

/**
 * Reduce stock from inventory
 * @param {number} inventoryId - Inventory ID
 * @param {Object} data - Stock data (variation_id, batch_id, quantity, note, related_invoice_id)
 * @returns {Promise}
 */
export const reduceStock = (inventoryId, data) => {
  return axiosInstance.post(`/inventory/${inventoryId}/stock/reduce`, data);
};

/**
 * Get stock balance for inventory/variation/batch
 * @param {number} inventoryId - Inventory ID
 * @param {Object} params - Query params (variation_id, batch_id)
 * @returns {Promise}
 */
export const getStockBalance = (inventoryId, params = {}) => {
  return axiosInstance.get(`/inventory/${inventoryId}/stock/balance`, { params });
};
