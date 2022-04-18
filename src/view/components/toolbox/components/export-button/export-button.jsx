import React from 'react';

const ExportButton = ({onClick})=>{
	return(
		<button className="icon-save export-button"
			onClick = {onClick}
		/>
	)
};

export default ExportButton;
