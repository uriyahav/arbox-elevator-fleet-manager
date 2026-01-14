import './ElevatorIcon.css';
import icon from '../icons8-elevator.svg';

export default function Elevator(props) {
    const style = {
        width: '35px',
        height: '35px',
        backgroundColor: props.color || 'black',
        // This 'masks' the background color into the shape of your SVG
        WebkitMaskImage: `url(${icon})`,
        maskImage: `url(${icon})`,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        display: 'inline-block'
    };

    return <div className="elevator-icon-display" style={style} />;
}