import React from "react";
import Select from "react-select";


const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        backgroundColor: 'transparent',
        color: state.isSelected ? 'white' : 'rgba(130,130,130)',
        border: '1px',
        backdropFilter: 'blur(4px)',
        boxShadow: '2px 2px 2px 0 rgba(0,0,0,0.3), -4px -4px 12px 0 rgba(0,0,0,0.25)'
    }),
    control: (provided, state) => ({
        ...provided,
        color:'white',
        // backgroundColor: 'transparent',
        backgroundColor: 'rgba(108, 108, 108, 0.79)',
        backdropFilter: 'blur(0.8px)'
    })
}
export default function SelectOptions(props) {
  const [selected, setSelected] = React.useState([]);
  const handleChange = (s) => {
    localStorage.setItem(props.key, JSON.stringify(s));
    setSelected(s);
  };

  React.useEffect(() => {
    const lastSelected = JSON.parse(localStorage.getItem(props.key) ?? "[]");
    setSelected(lastSelected);
  }, []);

  return (
    <div className="selectToken">
      <Select value={selected} onChange={handleChange} options={props.options} styles = {customStyles} theme={(theme) => ({
      ...theme,
      borderRadius: '10px',
      colors: {
        ...theme.colors,
        fontWeight: 'bold',
        primary25: '#c4f5f3',
        primary50: '#d9fffe',
        primary: '#17d2e3',
        // primary25: 'pink',
        // primary50: 'lightpink',
        // primary: 'hotpink',
      },
    })}/>
    </div>
  );
}
