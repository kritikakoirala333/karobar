import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline, IoCloudUploadOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import axiosInstance from "../axiosConfig";
import PageWrapper from "../layouts/page-wrapper";

function ShopCustomization() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const [formData, setFormData] = useState({
    shop_name: "",
    tagline: "",
    address: "",
    phone: "",
    landline: "",
    theme_colour: "blue",
    shipping_charge: "",
    facebook_page: "",
    insta_page: "",
    tiktok: "",
    slider_img_1_title: "",
    slider_img_1_url: "",
    slider_img_2_title: "",
    slider_img_2_url: "",
  });

  const [files, setFiles] = useState({
    logo: null,
    cover: null,
    slider_img_1: null,
    slider_img_2: null,
  });

  const [existingImages, setExistingImages] = useState({
    logo: null,
    cover: null,
    slider_img_1: null,
    slider_img_2: null,
  });

  const [customizationId, setCustomizationId] = useState(null);

  const themeColors = [
    { name: "Blue", value: "blue", color: "#0d6efd" },
    { name: "Purple", value: "purple", color: "#6f42c1" },
    { name: "Green", value: "green", color: "#198754" },
    { name: "Red", value: "red", color: "#dc3545" },
    { name: "Orange", value: "orange", color: "#fd7e14" },
    { name: "Pink", value: "pink", color: "#d63384" },
    { name: "Teal", value: "teal", color: "#20c997" },
    { name: "Indigo", value: "indigo", color: "#6610f2" },
  ];

  useEffect(() => {
    fetchCustomization();
  }, []);

  const fetchCustomization = async () => {
    try {
      const orgId = localStorage.getItem("organization_id") || 1;
      const response = await axiosInstance.get(
        `/shop-customization?organization_id=${orgId}`
      );

      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setCustomizationId(data.id);
        setFormData({
          shop_name: data.shop_name || "",
          tagline: data.tagline || "",
          address: data.address || "",
          phone: data.phone || "",
          landline: data.landline || "",
          theme_colour: data.theme_colour || "blue",
          shipping_charge: data.shipping_charge || "",
          facebook_page: data.facebook_page || "",
          insta_page: data.insta_page || "",
          tiktok: data.tiktok || "",
          slider_img_1_title: data.slider_img_1_title || "",
          slider_img_1_url: data.slider_img_1_url || "",
          slider_img_2_title: data.slider_img_2_title || "",
          slider_img_2_url: data.slider_img_2_url || "",
        });

        setExistingImages({
          logo: data.logo,
          cover: data.cover,
          slider_img_1: data.slider_img_1,
          slider_img_2: data.slider_img_2,
        });
      }
    } catch (error) {
      console.error("Error fetching customization:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (2MB max)
      if (file.size > 2048 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml"];
      if (!allowedTypes.includes(file.type)) {
        alert("Please upload a valid image file (jpg, png, gif, svg)");
        return;
      }

      setFiles((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };

  const handleRemoveImage = (fieldName) => {
    setFiles((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
    setExistingImages((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const orgId = localStorage.getItem("organization_id") || 1;
      const submitData = new FormData();

      submitData.append("organization_id", orgId);

      // Append all text fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      // Append files
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          submitData.append(key, files[key]);
        }
      });

      const response = await axiosInstance.post("/shop-customization", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Shop customization saved successfully!");
        fetchCustomization(); // Refresh data
      }
    } catch (error) {
      console.error("Error saving customization:", error);
      alert("Error saving customization. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getImagePreview = (fieldName) => {
    if (files[fieldName]) {
      return URL.createObjectURL(files[fieldName]);
    }
    if (existingImages[fieldName]) {
      return `${axiosInstance.defaults.baseURL}/storage/${existingImages[fieldName]}`;
    }
    return null;
  };

  if (loading) {
    return (
      <PageWrapper title="Shop Customization">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <div className="spinner-border text-dark" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Shop Customization">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between bg-light text-dark p-3 rounded-3 border mb-4">
        <div className="d-flex align-items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="btn btn-outline-secondary btn-sm p-1"
          >
            <IoChevronBackOutline className="fs-5" />
          </button>
          <div>
            <h5 className="mb-0">Shop Customization</h5>
            <small className="text-muted">Customize your e-commerce storefront</small>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="btn btn-primary px-4 py-2 rounded-3"
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-bottom mb-4">
        <div className="d-flex gap-4">
          {[
            { key: "basic", label: "Basic Info", icon: "info-circle" },
            { key: "branding", label: "Branding", icon: "palette" },
            { key: "social", label: "Social Media", icon: "share" },
            { key: "sliders", label: "Sliders", icon: "images" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`btn border-0 pb-3 px-0 ${
                activeTab === tab.key
                  ? "text-dark fw-semibold border-bottom border-3 border-dark"
                  : "text-secondary"
              }`}
              style={{ background: "transparent", fontSize: "15px" }}
            >
              <i className={`bi bi-${tab.icon} me-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="d-flex gap-4">
          {/* Main Content */}
          <div className="flex-fill">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="card p-4">
                <h6 className="mb-3 text-secondary">BASIC INFORMATION</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Shop Name *</label>
                    <input
                      type="text"
                      name="shop_name"
                      value={formData.shop_name}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter shop name"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Tagline</label>
                    <input
                      type="text"
                      name="tagline"
                      value={formData.tagline}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Your shop tagline"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="form-control"
                      rows="3"
                      placeholder="Enter shop address"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="+1234567890"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Landline</label>
                    <input
                      type="text"
                      name="landline"
                      value={formData.landline}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="+1987654321"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Shipping Charge (in cents)</label>
                    <input
                      type="number"
                      name="shipping_charge"
                      value={formData.shipping_charge}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="500"
                    />
                    <small className="text-muted">Example: 500 = $5.00</small>
                  </div>
                </div>
              </div>
            )}

            {/* Branding Tab */}
            {activeTab === "branding" && (
              <div className="card p-4">
                <h6 className="mb-3 text-secondary">BRANDING & THEME</h6>

                {/* Logo Upload */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Shop Logo</label>
                  <div className="border-2 border rounded-3 p-3" style={{ borderStyle: "dashed" }}>
                    {getImagePreview("logo") ? (
                      <div className="position-relative d-inline-block">
                        <img
                          src={getImagePreview("logo")}
                          alt="Logo"
                          style={{ maxHeight: "150px", maxWidth: "300px" }}
                          className="rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("logo")}
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <IoCloudUploadOutline className="fs-1 text-muted mb-2" />
                        <p className="text-muted mb-2">Click to upload logo (max 2MB)</p>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, "logo")}
                          accept="image/*"
                          className="form-control"
                          style={{ maxWidth: "300px", margin: "0 auto" }}
                        />
                      </div>
                    )}
                  </div>
                  <small className="text-muted">Recommended size: 200x80px</small>
                </div>

                {/* Cover Upload */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Cover/Banner Image</label>
                  <div className="border-2 border rounded-3 p-3" style={{ borderStyle: "dashed" }}>
                    {getImagePreview("cover") ? (
                      <div className="position-relative d-inline-block">
                        <img
                          src={getImagePreview("cover")}
                          alt="Cover"
                          style={{ maxHeight: "200px", maxWidth: "100%" }}
                          className="rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage("cover")}
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <IoCloudUploadOutline className="fs-1 text-muted mb-2" />
                        <p className="text-muted mb-2">Click to upload cover image (max 2MB)</p>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, "cover")}
                          accept="image/*"
                          className="form-control"
                          style={{ maxWidth: "300px", margin: "0 auto" }}
                        />
                      </div>
                    )}
                  </div>
                  <small className="text-muted">Recommended size: 1920x500px</small>
                </div>

                {/* Theme Color */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Theme Color</label>
                  <div className="d-flex flex-wrap gap-3">
                    {themeColors.map((theme) => (
                      <div
                        key={theme.value}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, theme_colour: theme.value }))
                        }
                        className={`border rounded-3 p-3 text-center ${
                          formData.theme_colour === theme.value
                            ? "border-dark border-3"
                            : "border-2"
                        }`}
                        style={{ cursor: "pointer", minWidth: "100px" }}
                      >
                        <div
                          className="rounded-circle mx-auto mb-2"
                          style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: theme.color,
                          }}
                        />
                        <small className="fw-semibold">{theme.name}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === "social" && (
              <div className="card p-4">
                <h6 className="mb-3 text-secondary">SOCIAL MEDIA LINKS</h6>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-facebook text-primary me-2"></i>
                      Facebook Page URL
                    </label>
                    <input
                      type="url"
                      name="facebook_page"
                      value={formData.facebook_page}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-instagram text-danger me-2"></i>
                      Instagram Page URL
                    </label>
                    <input
                      type="url"
                      name="insta_page"
                      value={formData.insta_page}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="https://instagram.com/yourpage"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      <i className="bi bi-tiktok text-dark me-2"></i>
                      TikTok Profile URL
                    </label>
                    <input
                      type="url"
                      name="tiktok"
                      value={formData.tiktok}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="https://tiktok.com/@yourprofile"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sliders Tab */}
            {activeTab === "sliders" && (
              <div className="card p-4">
                <h6 className="mb-3 text-secondary">SLIDER IMAGES</h6>

                {/* Slider 1 */}
                <div className="border rounded-3 p-3 mb-4">
                  <h6 className="fw-semibold mb-3">Slider 1</h6>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Image</label>
                    <div className="border-2 border rounded-3 p-3" style={{ borderStyle: "dashed" }}>
                      {getImagePreview("slider_img_1") ? (
                        <div className="position-relative d-inline-block">
                          <img
                            src={getImagePreview("slider_img_1")}
                            alt="Slider 1"
                            style={{ maxHeight: "200px", maxWidth: "100%" }}
                            className="rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage("slider_img_1")}
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-3">
                          <FiUpload className="fs-3 text-muted mb-2" />
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e, "slider_img_1")}
                            accept="image/*"
                            className="form-control"
                            style={{ maxWidth: "300px", margin: "0 auto" }}
                          />
                        </div>
                      )}
                    </div>
                    <small className="text-muted">Recommended size: 1200x400px</small>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Title</label>
                      <input
                        type="text"
                        name="slider_img_1_title"
                        value={formData.slider_img_1_title}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Slider title"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Link URL</label>
                      <input
                        type="url"
                        name="slider_img_1_url"
                        value={formData.slider_img_1_url}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Slider 2 */}
                <div className="border rounded-3 p-3">
                  <h6 className="fw-semibold mb-3">Slider 2</h6>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Image</label>
                    <div className="border-2 border rounded-3 p-3" style={{ borderStyle: "dashed" }}>
                      {getImagePreview("slider_img_2") ? (
                        <div className="position-relative d-inline-block">
                          <img
                            src={getImagePreview("slider_img_2")}
                            alt="Slider 2"
                            style={{ maxHeight: "200px", maxWidth: "100%" }}
                            className="rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage("slider_img_2")}
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-3">
                          <FiUpload className="fs-3 text-muted mb-2" />
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e, "slider_img_2")}
                            accept="image/*"
                            className="form-control"
                            style={{ maxWidth: "300px", margin: "0 auto" }}
                          />
                        </div>
                      )}
                    </div>
                    <small className="text-muted">Recommended size: 1200x400px</small>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Title</label>
                      <input
                        type="text"
                        name="slider_img_2_title"
                        value={formData.slider_img_2_title}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Slider title"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Link URL</label>
                      <input
                        type="url"
                        name="slider_img_2_url"
                        value={formData.slider_img_2_url}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview Sidebar */}
          <div className="card p-3" style={{ width: "400px", backgroundColor: "#f8f9fa" }}>
            <h6 className="mb-3 text-secondary">PREVIEW</h6>
            <div className="bg-white rounded-3 p-3 border">
              {/* Logo Preview */}
              {getImagePreview("logo") && (
                <div className="mb-3 text-center">
                  <img
                    src={getImagePreview("logo")}
                    alt="Logo Preview"
                    style={{ maxHeight: "60px" }}
                  />
                </div>
              )}

              {/* Shop Name */}
              <h5 className="text-center mb-1">
                {formData.shop_name || "Your Shop Name"}
              </h5>

              {/* Tagline */}
              {formData.tagline && (
                <p className="text-center text-muted small mb-3">{formData.tagline}</p>
              )}

              {/* Cover Preview */}
              {getImagePreview("cover") && (
                <div className="mb-3">
                  <img
                    src={getImagePreview("cover")}
                    alt="Cover Preview"
                    style={{ width: "100%", maxHeight: "120px", objectFit: "cover" }}
                    className="rounded"
                  />
                </div>
              )}

              {/* Theme Color Preview */}
              <div className="mb-3">
                <small className="text-muted d-block mb-1">Theme Color:</small>
                <div
                  className="rounded p-2 text-white text-center"
                  style={{
                    backgroundColor:
                      themeColors.find((t) => t.value === formData.theme_colour)?.color ||
                      "#0d6efd",
                  }}
                >
                  Sample Button
                </div>
              </div>

              {/* Contact Info */}
              {(formData.phone || formData.address) && (
                <div className="border-top pt-3 mt-3">
                  <small className="text-muted d-block mb-2">Contact Info:</small>
                  {formData.phone && (
                    <div className="mb-1">
                      <i className="bi bi-telephone me-2"></i>
                      <small>{formData.phone}</small>
                    </div>
                  )}
                  {formData.address && (
                    <div>
                      <i className="bi bi-geo-alt me-2"></i>
                      <small>{formData.address}</small>
                    </div>
                  )}
                </div>
              )}

              {/* Social Links */}
              {(formData.facebook_page || formData.insta_page || formData.tiktok) && (
                <div className="border-top pt-3 mt-3">
                  <small className="text-muted d-block mb-2">Social Media:</small>
                  <div className="d-flex gap-2">
                    {formData.facebook_page && (
                      <i className="bi bi-facebook fs-5 text-primary"></i>
                    )}
                    {formData.insta_page && (
                      <i className="bi bi-instagram fs-5 text-danger"></i>
                    )}
                    {formData.tiktok && <i className="bi bi-tiktok fs-5"></i>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </PageWrapper>
  );
}

export default ShopCustomization;
