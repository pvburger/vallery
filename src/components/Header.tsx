import { useState } from 'react';
import Button from './Button';
// import { dialog } from 'electron';

export default function Header() {
  const [openClicked, setOpenClicked] = useState(false);
  const [clearClicked, setClearClicked] = useState(false);
  const [optionClicked, setOptionClicked] = useState(false);

  const switchOpen = () => setOpenClicked(!openClicked);
  const switchClear = () => setClearClicked(!clearClicked);
  const switchOption = () => setOptionClicked(!optionClicked);

  // const openFiles = () => {
  //   console.log(
  //     dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
  //   );
  // };

  return (
    <div className='headContain'>
      <Button label='OPEN' flip={switchOpen} />
      <Button label='CLEAR' flip={switchClear} />
      <Button label='OPTIONS' flip={switchOption} />
    </div>
  );
}
