// PdfQuote.js
import React from "react";

const PdfQuote = React.forwardRef(({ data }, ref) => {
  const {
    company,
    address,
    edcBase,
    travelCost,
    overhangPrice,
    gableRail,
    gablePlatform,
    raisePlatformPrice,
    edgePrice,
    plywoodPrice,
    chimneyPrice,
    fullyPlanksPrice,
    topUp,
    EDCtotal,
    Alltotal,
  } = data;

  return (
    <div ref={ref} style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Scaffold Quote</h1>
      <p>
        <strong>Company:</strong> {company}
      </p>
      <p>
        <strong>Address:</strong> {address}
      </p>

      <hr />

      <h2>Breakdown</h2>
      <p>EDC Base: ${edcBase}</p>
      <p>Travel Cost: ${travelCost}</p>
      <p>Overhang: ${overhangPrice}</p>
      <p>Gable Rail: ${gableRail}</p>
      <p>Gable Platform: ${gablePlatform}</p>
      <p>Raise Platform: ${raisePlatformPrice}</p>
      <p>Edge Protection: ${edgePrice}</p>
      <p>Plywood: ${plywoodPrice}</p>
      <p>Chimney: ${chimneyPrice}</p>
      <p>Fully Planks: ${fullyPlanksPrice}</p>
      <p>Top Up: ${topUp}</p>

      <hr />

      <h3>EDC Total: ${EDCtotal.toFixed(2)}</h3>
      <h2>Total Quote: ${Alltotal.toFixed(2)}</h2>
    </div>
  );
});

export default PdfQuote;
