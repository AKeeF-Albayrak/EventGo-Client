import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/user/pages/HomePage'
import CreateEventPage from '../pages/user/pages/event/CreateEventPage'
import CityEventsPage from '../pages/user/pages/event/CityEventsPage'
import MyEventsPage from '../pages/user/pages/profile/MyEventsPage'
import CreatedEventsPage from '../pages/user/pages/profile/CreatedEventsPage'
import PointsHistoryPage from '../pages/user/pages/profile/PointsHistoryPage'
import SettingsPage from '../pages/user/pages/profile/SettingsPage'
import FeedbackPage from '../pages/user/pages/profile/FeedbackPage'
import EventDetailPage from '@/pages/user/pages/event/EventDetailPage'

const UserRoutes = () => (
  <Routes>
    <Route path="home" element={<HomePage />} />
    <Route path="create-event" element={<CreateEventPage />} />
    <Route path="city-events" element={<CityEventsPage />} />
    <Route path="profile/events" element={<MyEventsPage />} />
    <Route path="profile/my-events" element={<CreatedEventsPage />} />
    <Route path="profile/points" element={<PointsHistoryPage />} />
    <Route path="profile/settings" element={<SettingsPage />} />
    <Route path="feedback" element={<FeedbackPage />} />
    <Route path="events/:eventId" element={<EventDetailPage />} />
  </Routes>
)

export default UserRoutes