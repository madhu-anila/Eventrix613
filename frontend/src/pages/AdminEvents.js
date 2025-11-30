import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import API_CONFIG from '../config/api';
import './AdminEvents.css';

// ✅ FORCE NON-/api EVENTS URL
const EVENTS_BASE_URL = (() => {
  let base = API_CONFIG.event || '';

  if (base.endsWith('/')) base = base.slice(0, -1);
  if (base.endsWith('/api')) base = base.slice(0, -4);

  return `${base}/events`;
})();

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'conference',
    venue: '',
    date: '',
    time: '',
    capacity: '',
    price: '',
    organizer: '',
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in');
      throw new Error('No token');
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fetchEvents = async () => {
    try {
      const headers = getAuthHeaders();
      const res = await axios.get(EVENTS_BASE_URL, { headers });
      setEvents(res.data.events || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch events');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const headers = getAuthHeaders();
      await axios.post(EVENTS_BASE_URL, formData, { headers });
      toast.success('Event created');
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create event');
    }
  };

  const handleDelete = async (id) => {
    try {
      const headers = getAuthHeaders();
      await axios.delete(`${EVENTS_BASE_URL}/${id}`, { headers });
      toast.success('Event deleted');
      fetchEvents();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete event');
    }
  };

  return (
    <div className="admin-events">
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Title" onChange={e => setFormData({ ...formData, title: e.target.value })} />
        <input placeholder="Description" onChange={e => setFormData({ ...formData, description: e.target.value })} />
        <input placeholder="Venue" onChange={e => setFormData({ ...formData, venue: e.target.value })} />
        <input type="date" onChange={e => setFormData({ ...formData, date: e.target.value })} />
        <input type="time" onChange={e => setFormData({ ...formData, time: e.target.value })} />
        <input type="number" placeholder="Capacity" onChange={e => setFormData({ ...formData, capacity: e.target.value })} />
        <input type="number" placeholder="Price" onChange={e => setFormData({ ...formData, price: e.target.value })} />
        <input placeholder="Organizer" onChange={e => setFormData({ ...formData, organizer: e.target.value })} />

        <button type="submit">Create Event</button>
      </form>

      <h2>Events List</h2>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Venue</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev._id}>
              <td>{ev.title}</td>
              <td>{ev.venue}</td>
              <td>{new Date(ev.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDelete(ev._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminEvents;
