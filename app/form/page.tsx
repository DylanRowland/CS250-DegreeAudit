import Form from './form';
import TopBar from '../components/TopBar';

export default function Page() {
    return (
        <div className="font-sans">
            <TopBar />
            <Form />
        </div>
    );
}