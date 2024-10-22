import React from 'react';

function App() {
  return (
    <div>
      <button id="pbutton">Profile</button>
      <div className='pmodal'> 
        <div className='pmodal-content'>
            <span className="close">&times</span>
            <p> Profile stuff inside the Modal</p>
        </div>
      </div>
      </div>
  );
}

export default App;

/*
https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal
https://www.w3schools.com/howto/howto_css_modals.asp
*/
