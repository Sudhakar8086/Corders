import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import { styled } from '@mui/material/styles';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Icon from 'src/@core/components/icon'
import AddDocumentPopup from '../documents/AddDocumentPopup';

const icons=[
  'mdi:file-outline',
  'heroicons:folder-20-solid',
  'mdi:folder-open',
  'uil:edit-alt',
  'ci:house-01',
  'ci:chevron-left-duo',
  'mdi:application-edit-outline',
  'bx:file',
  'openmoji:delete'
]

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.common.black,
    minWidth: '580px', 
    flex: '20 30 auto',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },

  // hide last border
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}));


const MUITable = () => {
  const [showSpecialRows, setShowSpecialRows] = useState(false);
  const [showCoderDocumentSystem, setShowCoderDocumentSystem] = useState(false);
  const [showAdditionalRow, setShowAdditionalRow] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => { 
    setShowPopup(!showPopup);
  };

  const handleBackClick = () => {
    setShowSpecialRows(false);
    setShowCoderDocumentSystem(false);
    setShowAdditionalRow(false);
  };
  const handleFishRoomClick = () => {
    setShowSpecialRows(false);
    setShowAdditionalRow(!showAdditionalRow);
    console.log(showSpecialRows);
    console.log(showAdditionalRow);
  };
  const extraRows = [
    {
      icon: (
        <div className="icon-container">
          <Icon icon="mdi:folder-open" />
        </div>
      ),
      label: (
        <div onClick={ handleFishRoomClick} style={{ cursor: 'pointer' }}>
          Fish Room
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginLeft: 'Auto' }}>
              <Icon icon="openmoji:delete" />
              <div>Archive</div>
            </div>
            <div style={{ marginLeft: '50PX' }}>
              <Icon icon="uil:edit-alt" />
              <div>Rename</div>
            </div>
          </div>
        </div>
      ),
    },
  
    {
      icon: (
        <div className="icon-container">
          <Icon icon="mdi:folder-open" />
        </div>
      ),
      label: (
        <div>
          Nuts Room
          

          <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginLeft: 'Auto' }}>
          <Icon icon="openmoji:delete" />
          <div>Archive</div>
            </div>
          <div style={{ marginLeft: '50PX' }}>
          <Icon icon="uil:edit-alt" />
                    <div>Rename</div>
            </div>
          </div>
        </div>
      ),
    }
  ];
 
  const additionalRows = [
    {
      icon: (
        <div className="icon-container">
          <Icon icon="mdi:folder-open" />
        </div>
      ),
      label: (
        <div>
          wi-001
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginLeft: 'Auto' }}>
          <Icon icon="openmoji:delete" />
          <div>Archive</div>
            </div>
          <div style={{ marginLeft: '50PX' }}>
          <Icon icon="uil:edit-alt" />
                    <div>Rename</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: (
        <div className="icon-container">
          <Icon icon="mdi:folder-open" />
        </div>
      ),
      label: (
        <div>
          wi-003
        
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginLeft: 'Auto' }}>
          <Icon icon="openmoji:delete" />
          <div>Archive</div>
            </div>
          <div style={{ marginLeft: '50PX' }}>
          <Icon icon="uil:edit-alt" />
                    <div>Rename</div>
            </div>
          </div>
        </div>
      ),
    }
  ];
  const rowsToDisplay = showSpecialRows ? additionalRows : extraRows;
  

  const handleCoderDocumentClick = () => {
    setShowSpecialRows(!showSpecialRows);
  };
  
  return (
    <>
   {showSpecialRows && (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      
        <div onClick={handleBackClick} style={{ cursor: 'pointer', marginRight: '10px' }}>
          <Icon icon="ci:chevron-left-duo" />
          Back
        </div>
    

<div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
|<Icon icon="ci:house-01" />
        Home
      </div>
      <div  onClick={togglePopup} style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
       |<Icon icon="mdi:application-edit-outline" />
        <div style={{ marginLeft: '5px' }}>Add Document</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
     |<Icon icon="bx:file" />
        <div style={{ marginLeft: '5px' }}>Add Directory</div>
      </div>
      </div>
        )}
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>Document</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {showSpecialRows ? (
            <>
              {extraRows.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{row.icon}</StyledTableCell>
                  <StyledTableCell>{row.label}</StyledTableCell>
                </StyledTableRow>
              ))}
            </>
            
          ) : (
            
            <StyledTableRow onClick={handleCoderDocumentClick}>
              <StyledTableCell>
                <div className="icon-container">
                <Icon icon="mdi:folder-open" />
                </div>
              </StyledTableCell>
              <StyledTableCell>
                Coder document system
              </StyledTableCell>
              <StyledTableCell>
      <div style={{ display: 'flex', alignItems: 'center' }}>
                  {name}
                  <div style={{ marginLeft: '-200PX' }}>
                  <Icon icon="uil:edit-alt" />
                    <div>Rename</div>
                  </div>
                </div>
      </StyledTableCell>
            </StyledTableRow>
            
     )}
      {!showSpecialRows && (
            <>
         
           <StyledTableRow >
      <StyledTableCell>
        <div className="icon-container">
        <Icon icon="mdi:folder-open" />
        </div>
      </StyledTableCell>
      <StyledTableCell>
       External
      </StyledTableCell>
      <StyledTableCell>
      <div style={{ display: 'flex', alignItems: 'center' }}>
                 
                  <div style={{ marginLeft: '-200PX' }}>
                  <Icon icon="uil:edit-alt" />
                    <div>Rename</div>
            
                  </div>
                </div>
      </StyledTableCell>
    </StyledTableRow>
    <StyledTableRow >
      <StyledTableCell>
        <div className="icon-container">
        <Icon icon="mdi:folder-open" />
        </div>
      </StyledTableCell>
      <StyledTableCell>
      Internal
      </StyledTableCell>
      <StyledTableCell>
      <div style={{ display: 'flex', alignItems: 'center' }}>
              
                  <div style={{ marginLeft: '-200PX' }}>
                  <Icon icon="uil:edit-alt" />
                    <div>Rename</div>
                  </div>
                </div>
      </StyledTableCell>
    </StyledTableRow>
    </>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    {showPopup && <AddDocumentPopup />}
    </>
  );
};

export default MUITable;