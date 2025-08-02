import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function RedirectHandler() {
  const { shortcode } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:5000/resolve/${shortcode}`)
      .then((res) => {
        window.location.href = res.data.originalUrl;
      })
      .catch(() => {
        alert('Invalid or expired link.');
      });
  }, [shortcode]);

  return <p>Redirecting...</p>;
}
