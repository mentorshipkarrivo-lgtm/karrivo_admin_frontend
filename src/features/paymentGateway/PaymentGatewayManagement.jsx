import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  TrendingUp,
  Zap,
  Edit3,
  Play,
  Pause,
  Trash2,
  Plus,
  Filter,
  Users,
  Activity,
  Power,
  Calendar,
  Search,
} from "lucide-react";
import {
  useGetAllPaymentGatewaysQuery,
  useGetActivePaymentGatewayQuery,
  useGetPaymentGatewayStatsQuery,
  useCreatePaymentGatewayMutation,
  useUpdatePaymentGatewayMutation,
  useActivatePaymentGatewayMutation,
  useDeactivateAllPaymentGatewaysMutation,
  useDeletePaymentGatewayMutation,
} from "./paymentGatewayApiSlice";
import DashboardLayout from "../../Layout/DashboardLayout";

const PaymentGatewayManagement = () => {
  // State for managing UI
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGateway, setEditingGateway] = useState(null);
  const [newGatewayName, setNewGatewayName] = useState("");
  const [editGatewayName, setEditGatewayName] = useState("");
  const [filterActive, setFilterActive] = useState("all"); // all, active, inactive
  const [isCustomGateway, setIsCustomGateway] = useState(false);

  // API queries
  const {
    data: allGateways,
    isLoading: loadingGateways,
    refetch: refetchGateways,
  } = useGetAllPaymentGatewaysQuery();

  const { data: activeGateway, isLoading: loadingActiveGateway } =
    useGetActivePaymentGatewayQuery();

  const { data: gatewayStats, isLoading: loadingStats } =
    useGetPaymentGatewayStatsQuery();

  // API mutations
  const [createGateway, { isLoading: creatingGateway }] =
    useCreatePaymentGatewayMutation();
  const [updateGateway, { isLoading: updatingGateway }] =
    useUpdatePaymentGatewayMutation();
  const [activateGateway, { isLoading: activatingGateway }] =
    useActivatePaymentGatewayMutation();
  const [deactivateAllGateways, { isLoading: deactivatingAll }] =
    useDeactivateAllPaymentGatewaysMutation();
  const [deleteGateway, { isLoading: deletingGateway }] =
    useDeletePaymentGatewayMutation();

  // Toast configuration
  const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  // Handle create gateway
  const handleCreateGateway = async () => {
    const gatewayName = isCustomGateway
      ? newGatewayName.trim()
      : newGatewayName;

    if (!gatewayName) {
      toast.error("Please select or enter a gateway name", toastConfig);
      return;
    }

    try {
      const result = await createGateway({
        gatewayName: gatewayName,
        isActive: false,
      }).unwrap();

      if (result.success) {
        toast.success("Payment gateway created successfully!", toastConfig);
        setNewGatewayName("");
        setIsCustomGateway(false);
        setShowCreateModal(false);
        refetchGateways();
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to create payment gateway",
        toastConfig
      );
    }
  };

  // Handle predefined gateway selection
  const handlePredefinedGatewaySelect = (gatewayName) => {
    setNewGatewayName(gatewayName);
    setIsCustomGateway(false);
  };

  // Handle custom gateway toggle
  const handleCustomGatewayToggle = () => {
    setIsCustomGateway(true);
    setNewGatewayName("");
  };

  // Reset create modal
  const resetCreateModal = () => {
    setShowCreateModal(false);
    setNewGatewayName("");
    setIsCustomGateway(false);
  };

  // Handle edit gateway
  const handleEditGateway = async () => {
    if (!editGatewayName.trim()) {
      toast.error("Gateway name is required", toastConfig);
      return;
    }

    try {
      const result = await updateGateway({
        id: editingGateway._id,
        gatewayName: editGatewayName.trim(),
      }).unwrap();

      if (result.success) {
        toast.success("Payment gateway updated successfully!", toastConfig);
        setEditGatewayName("");
        setEditingGateway(null);
        setShowEditModal(false);
        refetchGateways();
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to update payment gateway",
        toastConfig
      );
    }
  };

  // Handle activate gateway (this will deactivate others automatically due to backend logic)
  const handleActivateGateway = async (gatewayId, gatewayName) => {
    try {
      const result = await activateGateway(gatewayId).unwrap();

      if (result.success) {
        toast.success(
          `${gatewayName} activated successfully! Other gateways deactivated.`,
          toastConfig
        );
        refetchGateways();
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to activate payment gateway",
        toastConfig
      );
    }
  };

  // Handle deactivate specific gateway
  const handleDeactivateGateway = async (gatewayId, gatewayName) => {
    try {
      const result = await updateGateway({
        id: gatewayId,
        isActive: false,
      }).unwrap();

      if (result.success) {
        toast.success(`${gatewayName} deactivated successfully!`, toastConfig);
        refetchGateways();
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to deactivate payment gateway",
        toastConfig
      );
    }
  };

  // Handle deactivate all gateways
  const handleDeactivateAll = async () => {
    if (
      window.confirm(
        "Are you sure you want to deactivate all payment gateways?"
      )
    ) {
      try {
        const result = await deactivateAllGateways().unwrap();

        if (result.success) {
          toast.success(
            "All payment gateways deactivated successfully!",
            toastConfig
          );
          refetchGateways();
        }
      } catch (error) {
        toast.error(
          error?.data?.message || "Failed to deactivate payment gateways",
          toastConfig
        );
      }
    }
  };

  // Handle delete gateway
  const handleDeleteGateway = async (gatewayId, gatewayName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${gatewayName}"? This action cannot be undone.`
      )
    ) {
      try {
        const result = await deleteGateway(gatewayId).unwrap();

        if (result.success) {
          toast.success(`${gatewayName} deleted successfully!`, toastConfig);
          refetchGateways();
        }
      } catch (error) {
        toast.error(
          error?.data?.message || "Failed to delete payment gateway",
          toastConfig
        );
      }
    }
  };

  // Open edit modal
  const openEditModal = (gateway) => {
    setEditingGateway(gateway);
    setEditGatewayName(gateway.gatewayName);
    setShowEditModal(true);
  };

  // Filter gateways based on active status
  const filteredGateways =
    allGateways?.data?.filter((gateway) => {
      if (filterActive === "active") return gateway.isActive;
      if (filterActive === "inactive") return !gateway.isActive;
      return true; // "all"
    }) || [];

  // Enhanced Stats Card Component
  const StatsCard = ({
    title,
    value,
    icon: IconComponent,
    color,
    isLoading,
    gradient,
  }) => (
    <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4">
      <div
        className="card h-100 border-0 shadow-lg position-relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
          transform: "translateY(0)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow =
            "0 10px 25px rgba(255, 107, 53, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        <div className="position-absolute top-0 end-0 p-3 opacity-25">
          <IconComponent size={60} color="white" />
        </div>
        <div className="card-body text-white position-relative">
          <div className="d-flex align-items-center mb-3">
            <div
              className="p-3 rounded-circle me-3"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <IconComponent size={24} color="white" />
            </div>
            <div>
              <h6 className="card-title mb-0 text-white-50 small fw-normal">
                {title}
              </h6>
            </div>
          </div>
          {isLoading ? (
            <div className="d-flex align-items-center justify-content-center py-2">
              <div
                className="spinner-border spinner-border-sm text-white"
                role="status"
                style={{ width: "1.5rem", height: "1.5rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <h2
              className="mb-0 fw-bold text-white"
              style={{ fontSize: "2rem" }}
            >
              {value || 0}
            </h2>
          )}
        </div>
      </div>
    </div>
  );

  // Enhanced Gateway Card Component
  const GatewayCard = ({ gateway }) => (
    <div className="col-xl-4 col-lg-6 col-md-6 mb-4">
      <div
        className="card h-100 border-0 shadow-lg position-relative overflow-hidden"
        style={{
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
          transform: "translateY(0)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow =
            "0 15px 35px rgba(255, 107, 53, 0.2)";
          e.currentTarget.style.borderColor = "#ff6b35";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "";
          e.currentTarget.style.borderColor = "#334155";
        }}
      >
        {/* Active indicator */}
        {gateway.isActive && (
          <div
            className="position-absolute top-0 end-0"
            style={{
              width: "0",
              height: "0",
              borderLeft: "50px solid transparent",
              borderTop: "50px solid #f29b0a",
            }}
          >
            <CheckCircle
              size={16}
              color="white"
              className="position-absolute"
              style={{ top: "-45px", right: "-45px" }}
            />
          </div>
        )}

        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center">
              <div
                className="p-3 rounded-circle me-3"
                style={{
                  backgroundColor: gateway.isActive ? "#f29b0a" : "#64748b",
                }}
              >
                <CreditCard size={24} color="white" />
              </div>
              <div>
                <h5 className="card-title text-white mb-1 fw-bold">
                  {gateway.gatewayName}
                </h5>
                <span
                  className={`badge px-3 py-2 rounded-pill ${
                    gateway.isActive
                      ? "text-white fw-semibold"
                      : "bg-secondary text-white"
                  }`}
                  style={{
                    backgroundColor: gateway.isActive ? "#f29b0a" : "#64748b",
                    fontSize: "0.75rem",
                  }}
                >
                  {gateway.isActive ? (
                    <>
                      <Power size={12} className="me-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <Pause size={12} className="me-1" />
                      Inactive
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="row g-2">
              <div className="col-12">
                <div
                  className="p-3 rounded"
                  style={{
                    backgroundColor: "rgba(255, 107, 53, 0.1)",
                    border: "1px solid rgba(255, 107, 53, 0.2)",
                  }}
                >
                  <div className="d-flex align-items-center text-white mb-2">
                    <Calendar
                      size={14}
                      className="me-2"
                      style={{ color: "#fff" }}
                    />
                    <small className="fw-medium ">Created</small>
                  </div>
                  <small className="text-white-50">
                    {new Date(gateway.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </small>
                </div>
              </div>
              <div className="col-12">
                <div
                  className="p-3 rounded"
                  style={{
                    backgroundColor: "rgba(100, 116, 139, 0.1)",
                    border: "1px solid rgba(100, 116, 139, 0.2)",
                  }}
                >
                  <div className="d-flex align-items-center text-white mb-2">
                    <Activity
                      size={14}
                      className="me-2"
                      style={{ color: "#fff" }}
                    />
                    <small className="fw-medium">Last Updated</small>
                  </div>
                  <small className="text-white-50">
                    {new Date(gateway.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            {/* Activate/Deactivate Button */}
            {gateway.isActive ? (
              <button
                className="btn btn-warning btn-sm flex-fill d-flex align-items-center justify-content-center"
                onClick={() =>
                  handleDeactivateGateway(gateway._id, gateway.gatewayName)
                }
                disabled={activatingGateway || updatingGateway}
                style={{
                  backgroundColor: "#f59e0b",
                  borderColor: "#f59e0b",
                  minHeight: "40px",
                }}
              >
                {activatingGateway || updatingGateway ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : (
                  <Pause size={16} className="me-2" />
                )}
                Deactivate
              </button>
            ) : (
              <button
                className="btn btn-sm flex-fill d-flex align-items-center justify-content-center"
                onClick={() =>
                  handleActivateGateway(gateway._id, gateway.gatewayName)
                }
                disabled={activatingGateway}
                style={{
                  backgroundColor: "#ff6b35",
                  borderColor: "#ff6b35",
                  color: "white",
                  minHeight: "40px",
                }}
              >
                {activatingGateway ? (
                  <span className="spinner-border spinner-border-sm me-2"></span>
                ) : (
                  <Play size={16} className="me-2" />
                )}
                Activate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <DashboardLayout>
        <section className="profile_section py-4">
          <div className="container-fluid">
            <div
              className="rounded-3 px-4 pb-4 py-4 position-relative overflow-hidden"
              style={{ backgroundColor: "#0f172a", minHeight: "100vh" }}
            >
              {/* Header Section */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5">
                <div>
                  <h3 className="mb-2 text-white fw-bold">
                    <CreditCard
                      size={32}
                      className="me-3"
                      style={{ color: "#ff6b35" }}
                    />
                    Payment Gateway Management
                  </h3>
                  <p className="text-white mb-0">
                    Manage and monitor your payment gateways
                  </p>
                </div>
                {/* <button
                  className="btn btn-lg mt-3 mt-md-0 d-flex align-items-center"
                  onClick={() => setShowCreateModal(true)}
                  style={{ 
                    backgroundColor: '#ff6b35',
                    borderColor: '#ff6b35',
                    color: 'white'
                  }}
                >
                  <Plus size={20} className="me-2" />
                  Add Gateway
                </button> */}
              </div>

              {/* Stats Section */}
              <div className="row mb-5">
                <StatsCard
                  title="Total Gateways"
                  value={gatewayStats?.data?.totalGateways}
                  icon={CreditCard}
                  color="text-primary"
                  isLoading={loadingStats}
                  gradient={{ from: "#f59e0b", to: "#d97706" }}
                />
                <StatsCard
                  title="Current Active"
                  value={gatewayStats?.data?.currentActiveGateway || "None"}
                  icon={Zap}
                  color="text-warning"
                  isLoading={loadingStats}
                  gradient={{ from: "#f59e0b", to: "#d97706" }}
                />
                <StatsCard
                  title="Active Gateways"
                  value={gatewayStats?.data?.activeGateways}
                  icon={CheckCircle}
                  color="text-success"
                  isLoading={loadingStats}
                  gradient={{ from: "#f59e0b", to: "#d97706" }}
                />
                <StatsCard
                  title="Inactive Gateways"
                  value={gatewayStats?.data?.inactiveGateways}
                  icon={XCircle}
                  color="text-danger"
                  isLoading={loadingStats}
                  gradient={{ from: "#b74f0b", to: "#b74f0b" }}
                />
              </div>

              {/* Active Gateway Alert */}
              {activeGateway?.data && (
                <div
                  className="alert mb-4 border-0 shadow-sm"
                  role="alert"
                  style={{
                    backgroundColor: "rgba(255, 107, 53, 0.1)",
                    borderLeft: "4px solid #ff6b35",
                  }}
                >
                  <div className="d-flex align-items-center">
                    <Zap
                      size={20}
                      className="me-2"
                      style={{ color: "#ff6b35" }}
                    />
                    <strong className="text-white">Active Gateway:</strong>
                    <span className="text-white ms-2">
                      {activeGateway.data.gatewayName}
                    </span>
                  </div>
                </div>
              )}

              {/* Filter Section */}
              <div className="mb-4">
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <div className="d-flex align-items-center me-3">
                    <Filter
                      size={18}
                      className="me-2"
                      style={{ color: "#ff6b35" }}
                    />
                    <span className="text-white fw-medium">Filter:</span>
                  </div>
                  <button
                    className={`btn btn-sm ${
                      filterActive === "all"
                        ? "text-white"
                        : "btn-outline-light"
                    }`}
                    onClick={() => setFilterActive("all")}
                    style={{
                      backgroundColor:
                        filterActive === "all" ? "#f29b0a" : "transparent",
                      borderColor:
                        filterActive === "all" ? "#f29b0a" : "#64748b",
                    }}
                  >
                    All ({allGateways?.data?.length || 0})
                  </button>
                  <button
                    className={`btn btn-sm ${
                      filterActive === "active"
                        ? "text-white"
                        : "btn-outline-light"
                    }`}
                    onClick={() => setFilterActive("active")}
                    style={{
                      backgroundColor:
                        filterActive === "active" ? "#f29b0a" : "transparent",
                      borderColor:
                        filterActive === "active" ? "#f29b0a" : "#64748b",
                    }}
                  >
                    Active ({gatewayStats?.data?.activeGateways || 0})
                  </button>
                  <button
                    className={`btn btn-sm ${
                      filterActive === "inactive"
                        ? "text-white"
                        : "btn-outline-light"
                    }`}
                    onClick={() => setFilterActive("inactive")}
                    style={{
                      backgroundColor:
                        filterActive === "inactive" ? "#f29b0a" : "transparent",
                      borderColor:
                        filterActive === "inactive" ? "#f29b0a" : "#64748b",
                    }}
                  >
                    Inactive ({gatewayStats?.data?.inactiveGateways || 0})
                  </button>
                </div>
              </div>

              {/* Gateways Grid */}
              {loadingGateways ? (
                <div className="text-center py-5">
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                    style={{
                      width: "3rem",
                      height: "3rem",
                      color: "#ff6b35 !important",
                    }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-white h5">Loading payment gateways...</p>
                  <p className="text-muted">
                    Please wait while we fetch your data
                  </p>
                </div>
              ) : filteredGateways.length > 0 ? (
                <div className="row">
                  {filteredGateways.map((gateway) => (
                    <GatewayCard key={gateway._id} gateway={gateway} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <div
                    className="p-4 rounded-circle mx-auto mb-4"
                    style={{
                      backgroundColor: "rgba(255, 107, 53, 0.1)",
                      width: "100px",
                      height: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CreditCard size={48} style={{ color: "#ff6b35" }} />
                  </div>
                  <h5 className="text-white mb-3">No payment gateways found</h5>
                  <p className="text-muted mb-4">
                    {filterActive !== "all"
                      ? `No ${filterActive} gateways available`
                      : "Create your first payment gateway to get started"}
                  </p>
                  {filterActive === "all" && (
                    <button
                      className="btn btn-lg d-flex align-items-center mx-auto"
                      onClick={() => setShowCreateModal(true)}
                      style={{
                        backgroundColor: "#ff6b35",
                        borderColor: "#ff6b35",
                        color: "white",
                      }}
                    >
                      <Plus size={20} className="me-2" />
                      Create Gateway
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Create Gateway Modal */}
          {/* {showCreateModal && (
            <div
              className="modal show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div 
                  className="modal-content border-0 shadow-lg"
                  style={{ backgroundColor: "#1e293b" }}
                >
                  <div 
                    className="modal-header border-0"
                    style={{ borderBottom: '1px solid #334155' }}
                  >
                    <h5 className="modal-title text-white d-flex align-items-center">
                      <Plus size={24} className="me-2" style={{ color: '#ff6b35' }} />
                      Add New Payment Gateway
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={resetCreateModal}
                    ></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="mb-4">
                      <label className="form-label text-white fw-medium mb-3">Select Gateway Type</label>
                      <div className="d-flex gap-2 mb-3 flex-wrap">
                        {[
                          "Razorpay",
                          "PhonePe",
                          "PayPal",
                          "Stripe",
                          "Paytm",
                        ].map((gateway) => (
                          <button
                            key={gateway}
                            type="button"
                            className={`btn btn-sm ${
                              newGatewayName === gateway && !isCustomGateway
                                ? "text-white"
                                : "btn-outline-primary"
                            }`}
                            onClick={() =>
                              handlePredefinedGatewaySelect(gateway)
                            }
                            style={{
                              backgroundColor: newGatewayName === gateway && !isCustomGateway ? '#ff6b35' : 'transparent',
                              borderColor: newGatewayName === gateway && !isCustomGateway ? '#ff6b35' : '#3b82f6'
                            }}
                          >
                            {gateway}
                          </button>
                        ))}
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            isCustomGateway
                              ? "text-white"
                              : "btn-outline-warning"
                          }`}
                          onClick={handleCustomGatewayToggle}
                          style={{
                            backgroundColor: isCustomGateway ? '#f59e0b' : 'transparent',
                            borderColor: isCustomGateway ? '#f59e0b' : '#f59e0b'
                          }}
                        >
                          Custom
                        </button>
                      </div>
                    </div>

                    {isCustomGateway && (
                      <div className="mb-4">
                        <label
                          htmlFor="customGatewayName"
                          className="form-label text-white fw-medium"
                        >
                          Custom Gateway Name
                        </label>
                        <input
                          type="text"
                          className="form-control bg-dark text-white border-secondary"
                          id="customGatewayName"
                          value={newGatewayName}
                          onChange={(e) => setNewGatewayName(e.target.value)}
                          placeholder="Enter custom gateway name"
                          style={{ 
                            backgroundColor: '#0f172a',
                            borderColor: '#334155',
                            color: 'white'
                          }}
                        />
                      </div>
                    )}

                    {!isCustomGateway && newGatewayName && (
                      <div 
                        className="alert border-0"
                        style={{ 
                          backgroundColor: 'rgba(255, 107, 53, 0.1)',
                          borderLeft: '3px solid #ff6b35'
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <CheckCircle size={18} className="me-2" style={{ color: '#ff6b35' }} />
                          <span className="text-white">Selected: <strong>{newGatewayName}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div 
                    className="modal-footer border-0 p-4"
                    style={{ borderTop: '1px solid #334155' }}
                  >
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={resetCreateModal}
                      style={{ 
                        backgroundColor: '#64748b',
                        borderColor: '#64748b'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn d-flex align-items-center"
                      onClick={handleCreateGateway}
                      disabled={creatingGateway}
                      style={{ 
                        backgroundColor: '#ff6b35',
                        borderColor: '#ff6b35',
                        color: 'white'
                      }}
                    >
                      {creatingGateway ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus size={16} className="me-2" />
                          Create Gateway
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </section>
      </DashboardLayout>
    </>
  );
};

export default PaymentGatewayManagement;
