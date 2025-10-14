function SupplierCard({supplierInfo, handler}) {
  return <>
    <div className="row m-0 p-0" onClick={() => handler(supplierInfo)}>
      {/* <div className="col-3 bg-info p-2"></div> */}
      <div className="col-12 p-2 customerCard">
        <span className="fw-semibold">{supplierInfo.suppliername}</span>
        <br />
        <span className="fw-normal">{supplierInfo.address}</span>
      </div>
    </div>
  </>
}
export default SupplierCard;