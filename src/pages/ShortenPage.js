import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Paper, Grid
} from '@mui/material';
import axios from 'axios';
import { logAction } from '../middleware/logger';
import { isValidURL, isValidShortcode } from '../utils/validators';

export default function ShortenPage() {
  const [urls, setUrls] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const addField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { url: '', validity: '', shortcode: '' }]);
    }
  };

  const handleSubmit = async () => {
    const data = [];

    for (const u of urls) {
      if (!isValidURL(u.url)) return alert('Invalid URL: ' + u.url);
      if (u.shortcode && !isValidShortcode(u.shortcode)) return alert('Invalid shortcode');

      data.push({
        originalUrl: u.url,
        validity: u.validity ? parseInt(u.validity) : 30,
        shortcode: u.shortcode || undefined,
      });
    }

    logAction('SHORTEN_ATTEMPT', data);

    try {
      const res = await axios.post('http://localhost:5000/shorten', { urls: data });
      setResults(res.data);
      logAction('SHORTEN_SUCCESS', res.data);
    } catch (err) {
      logAction('SHORTEN_FAILURE', err.response?.data || err.message);
      alert('Shortening failed.');
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>🔗 URL Shortener</Typography>

      {urls.map((item, i) => (
        <Paper key={i} sx={{ p: 2, mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Original URL"
                value={item.url}
                fullWidth
                onChange={(e) => handleChange(i, 'url', e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Validity (min)"
                value={item.validity}
                fullWidth
                type="number"
                onChange={(e) => handleChange(i, 'validity', e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Custom Shortcode"
                value={item.shortcode}
                fullWidth
                onChange={(e) => handleChange(i, 'shortcode', e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Button onClick={addField} disabled={urls.length >= 5} sx={{ mt: 2 }}>
        Add More
      </Button>
      <Button variant="contained" onClick={handleSubmit} sx={{ ml: 2, mt: 2 }}>
        Shorten All
      </Button>

      {results.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <Typography variant="h6">Results</Typography>
          {results.map((r, i) => (
            <Paper key={i} sx={{ p: 2, mt: 1 }}>
              <Typography>🔗 <a href={`/${r.shortcode}`}>{`http://localhost:3000/${r.shortcode}`}</a></Typography>
              <Typography>⏰ Expires: {r.expiresAt}</Typography>
            </Paper>
          ))}
        </div>
      )}
    </Container>
  );
}
