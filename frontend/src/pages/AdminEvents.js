import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import API_CONFIG from '../config/api';
import './AdminEvents.css';

// Normalize base URL for events so it NEVER uses /api
// Examples:
//  - API_CONFIG.event = 'https://aware-gratitude-production.up.railway.app'
//      -> EVENTS_BASE_URL = 'https://aware-gratitude-production.up.railway.app/events'
//  - API_CONFIG.event = 'https://aware-gratitude-production.up.railway.app/api'
//      -> EVENTS_BASE_URL = 'https://aware-gratitude-production.up.railway.app/events'
const EVENTS_BASE_URL = (() => {
  let base = API_CONFIG.event || '';

  // Remove any trailing slash
  if (base.endsWith('/')) {
    base = base.slice(0, -1);
  }

  // If someone accidentally puts /api in the env, strip it
  if (base.endsWith('/api')) {
    base = base.slice(0, -4); // remove "/api"
  }

  // If it already ends with /events, just use it
  if (base.endsWith('/events')) {
    return base;
  }

  // Otherwise, always call /events on that base
  return `${base}/events`;
})();

// Utility function to convert 24-hour to 12-hour format
const formatTime = (timeStr) => {
  if (!timeStr) return '';
  if (/AM|PM/i.test(timeStr)) return timeStr;

  const [hours, minutes] = timeStr.split(':');
  let hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';

  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;

  return `${hour}:${minutes} ${period}`;
};

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
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
    imageUrl: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const getAuthHeaders = () => {
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('authToken') ||
      localStorage.getItem('accessToken');

    if (!token) {
      toast.error('You must be logged in as an admin to manage events');
      throw new Error('No auth token found');
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchEvents = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await axios.get(EVENTS_BASE_URL, { headers });
      setEvents(response.data.events || response.data);
    } catch (err) {
      console.error(
        'Error fetching events:',
        err.response?.status,
        err.response?.data || err.message
      );
      if (err.response?.status === 401) {
        toast.error('Unauthorized to fetch events. Please log in again as admin.');
      } else {
        toast.error('Failed to load events');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || formData.title.length < 3) {
      toast.error('Event title must be at least 3 characters');
      return;
    }
    if (!formData.description || formData.description.length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }
    if (!formData.venue || formData.venue.length < 3) {
      toast.error('Venue must be at least 3 characters');
      return;
    }
    if (!formData.date) {
      toast.error('Please select an event date');
      return;
    }
    const selectedDate = new Date(formData.date);
    if (selectedDate <= new Date()) {
      toast.error('Event date must be in the future');
      return;
    }
    if (!formData.time) {
      toast.error('Please select an event time');
      return;
    }
    if (!formData.capacity || formData.capacity < 1) {
      toast.error('Capacity must be at least 1');
      return;
    }
    if (formData.price === '' || formData.price < 0) {
      toast.err
