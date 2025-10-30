import { useState } from 'react';
import Button from './Button';
// import { dialog } from 'electron';

export default function Header() {
  const [openClicked, setOpenClicked] = useState(false);
  const [clearClicked, setClearClicked] = useState(false);
  const [optionClicked, setOptionClicked] = useState(false);

  // const switchOpen = () => setOpenClicked(!openClicked);
  const switchClear = () => setClearClicked(!clearClicked);
  const switchOption = () => setOptionClicked(!optionClicked);

  const getFileList = async (): Promise<void> => {
    const fileList = await window.valleryAPI.selectFiles();
    console.log('Files selected:');
    for (const item of fileList) console.log(item);
  };

  return (
    <div className='headContain'>
      <Button label='OPEN' runFun={getFileList} />
      <Button label='CLEAR' runFun={switchClear} />
      <Button label='OPTIONS' runFun={switchOption} />
    </div>
  );
}
