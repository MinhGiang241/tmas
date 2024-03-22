import React from "react";

function Collaborator({ hidden }: { hidden: boolean }) {
  return <div className={`${hidden ? "hidden" : ""}`}>Cộng tác viên</div>;
}

export default Collaborator;
