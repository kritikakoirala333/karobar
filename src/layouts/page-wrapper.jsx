const PageWrapper = ({
  title = "Blank Title",
  subtitle = "This one is the subtitle",
  icon = "bi bi-arrow-left",
  trailing,
  children,
  
}) => {
  return (
    <>
      <div className="col-12 row m-0 p-0">
        <div className="col-12 m-0 p-0 mb-2">
          <div className="d-flex justify-content-start align-items-center gap-2 ">
            <div
              className="cursor-pointer"
              style={{
                width: "45px",
                height: "45px",
                background: "rgba(0,0,0,0.1)",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <i className={icon}></i>
            </div>
            <div style={{width:"calc(20% - 45px)"}} className="d-flex flex-column m-0 p-0 cursor-pointer">
              <h4 className="mb-0">{title}</h4>
              <small>{subtitle}</small>
            </div>
            <div
              style={{ width: "80%",padding: "10px" }}
            >
                {trailing}
            </div>
          </div>
        </div>
        <div className="col-12 border rounded-1 p-3 mt-1">{children}</div>
      </div>
    </>
  );
};

export default PageWrapper;
