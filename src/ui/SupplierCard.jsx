function SupplierCard({supplierInfo, handler}) {
  return (
    <div className="row m-0 p-0" onClick={() => handler(supplierInfo)}>
      <div className="col-12 p-2 customerCard">
        <span className="fw-semibold">{supplierInfo.name}</span>
        <br />
        <span className="fw-normal">
          {supplierInfo.address || 'No Address'}, {supplierInfo.phone}
        </span>
      </div>
    </div>
  );
}

export default SupplierCard;