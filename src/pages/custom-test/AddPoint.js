import PropTypes from "prop-types";

const AddPoints = ({
  AddPoint,
  AddIcon,
  AddPolygon,
  AddPolyline,
  Space,
  setTask,
}) => {
  const ButtonListContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "center",
    gap: "1rem",
  };
  return (
    <div style={ButtonListContainer}>
      {Space ? (
        <>
          <button
            onClick={() => {
              setTask("drawPoint");
            }}
          >
            Add Point
          </button>
          <button
            onClick={() => {
              console.log("Add Point");
            }}
          >
            Add Point
          </button>
          <button
            onClick={() => {
              console.log("Add Point");
            }}
          >
            Add Point
          </button>
        </>
      ) : (
        <div>Space is not ready</div>
      )}
    </div>
  );
};

AddPoints.propTypes = {
  AddPoint: PropTypes.func.isRequired,
  AddIcon: PropTypes.func.isRequired,
  AddPolygon: PropTypes.func.isRequired,
  AddPolyline: PropTypes.func.isRequired,
  Space: PropTypes.object.isRequired,
  setTask: PropTypes.func.isRequired,
};

export default AddPoints;
