function CustomerCard({customerInfo, handler}) {
  return <>
    <div className="row m-0 p-0" onClick={() => handler(customerInfo)}>
      {/* <div className="col-3 bg-info p-2"></div> */}
      <div className="col-12 p-2 customerCard">
        <span className="fw-semibold">{customerInfo.name}</span>
        <br />
        <span className="fw-normal">{customerInfo.address ?? 'No Address'}, {customerInfo.phone}</span>
      </div>
    </div>
  </>
}
export default CustomerCard;