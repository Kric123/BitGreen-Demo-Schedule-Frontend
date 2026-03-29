import { useForm } from "react-hook-form";
import { useState } from "react";
import './LookUp.css'
import { scheduleApi } from '../services/scheduleApi'
import type { ScheduleData, UpdateScheduleData } from '../services/scheduleApi'

//used to change time from 24hr to 12hr format for display purposes
function formatTime(timeString: string) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}
// Form component for editing schedule
function EditForm({ item, onSave, onCancel }: { item: ScheduleData, onSave: (data: UpdateScheduleData) => void, onCancel: () => void }) {
  const { register, handleSubmit } = useForm<UpdateScheduleData>({
    defaultValues: {
      date: item.date_Scheduled || item.dateScheduled || '',
      time: item.time_Scheduled || item.timeScheduled || ''
    }
  });

  const onSubmit = (data: UpdateScheduleData) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="edit-form">
      <h3>Reschedule</h3>
      <label>
        New Date
        <input type="date" {...register('date', { required: true })} />
      </label>
      <label>
        New Time
        <select {...register('time', { required: true })}>
          {Array.from({ length: 24 }, (_, i) => {
            const hour = i.toString().padStart(2, '0');
            return <option key={hour} value={`${hour}:00`}>{formatTime(`${hour}:00`)}</option>;
          })}
        </select>
      </label>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}

function LookUp() {
  const { register, handleSubmit, formState:{errors} } = useForm()
  const [scheduleData, setScheduleData] = useState<ScheduleData | ScheduleData[] | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  // Fetch schedule data based on first and last name
  async function onSubmit(data: any) {
    try {
      const result = await scheduleApi.getSchedulesByName(data.firstname, data.lastname);
      setScheduleData(result);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      setScheduleData(null);
    }
  }
  // Delete schedule by ID
  async function deleteSchedule(id: number) {
    try {
      await scheduleApi.deleteSchedule(id);
      // Remove the deleted item from scheduleData
      if (Array.isArray(scheduleData)) {
        setScheduleData(scheduleData.filter((item: any) => item.id !== id));
      } else if (scheduleData && 'id' in scheduleData && scheduleData.id === id) {
        setScheduleData(null);
      }
      alert('Schedule deleted successfully');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  }
  // Update schedule with new date and time
  async function updateSchedule(item: ScheduleData, newData: UpdateScheduleData) {
    try {
      await scheduleApi.updateSchedule(item.id, {
        date: newData.date,
        time: newData.time,
        firstname: item.firstname || item.firstName || '',
        lastname: item.lastname || item.lastName || '',
        email: item.email,
        phone: item.phone,
      });
      // Update the item in scheduleData
      if (Array.isArray(scheduleData)) {
        setScheduleData(scheduleData.map((sched: any) =>
          sched.id === item.id ? { ...sched, date_Scheduled: newData.date, time_Scheduled: newData.time } : sched
        ));
      } else if (scheduleData && 'id' in scheduleData && scheduleData.id === item.id) {
        setScheduleData({ ...scheduleData, date_Scheduled: newData.date, time_Scheduled: newData.time });
      }
      setEditingId(null);
      alert('Schedule updated successfully');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  }

  return (
    <div className="schedule-root">
      <h1>LookUp</h1>
      <form className="schedule-form" onSubmit={handleSubmit(onSubmit)}>
        <label>
          First Name
          <input
            placeholder="First Name"
            {...register('firstname', { required: "First Name is required" })}
          />
        </label>
        {errors.firstname && <span className='error'>First Name is required</span>}

        <label>
          Last Name
          <input
            type="text"
            placeholder='Last Name'
            {...register('lastname', { required: "Last Name is required" })}
          />
        </label>
        {errors.lastname && <span className='error'>Last Name is required</span>}


        <button type="submit" className="submit-btn">Submit</button>
      </form>
      {scheduleData && (
        <div className="schedule-result">
          <h2>Schedule Details</h2>
          {Array.isArray(scheduleData) ? (
            scheduleData.length > 0 ? (
              scheduleData.map((item, index) => (
                <div key={item.id || index} className="schedule-item">
                  {editingId === item.id ? (
                    <EditForm item={item} onSave={(newData) => updateSchedule(item, newData)} onCancel={() => setEditingId(null)} />
                  ) : (
                    <>
                                          <h3>Schedule {index + 1}</h3>
                      <p><strong>First Name:</strong> {item.firstname || item.firstName}</p>
                      <p><strong>Last Name:</strong> {item.lastname || item.lastName}</p>
                      <p><strong>Email:</strong> {item.email}</p>
                      <p><strong>Phone:</strong> {item.phone}</p>
                      <p><strong>Date Scheduled:</strong> {item.date_Scheduled || item.dateScheduled}</p>
                      <p><strong>Time Scheduled:</strong> {formatTime(item.time_Scheduled || item.timeScheduled || '')}</p>
                      <button onClick={() => deleteSchedule(item.id)} className="delete-btn">Delete</button>
                      <button onClick={() => setEditingId(item.id)} className="reschedule-btn">Reschedule</button>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p>No schedules found.</p>
            )
          ) : (
            <div className="schedule-item">
              {editingId === scheduleData.id ? (
                <EditForm item={scheduleData as ScheduleData} onSave={(newData) => updateSchedule(scheduleData as ScheduleData, newData)} onCancel={() => setEditingId(null)} />
              ) : (
                <>
                  <p><strong>First Name:</strong> {scheduleData.firstname || scheduleData.firstName}</p>
                  <p><strong>Last Name:</strong> {scheduleData.lastname || scheduleData.lastName}</p>
                  <p><strong>Email:</strong> {scheduleData.email}</p>
                  <p><strong>Phone:</strong> {scheduleData.phone}</p>
                  <p><strong>Date Scheduled:</strong> {scheduleData.date_Scheduled || scheduleData.dateScheduled}</p>
                  <p><strong>Time Scheduled:</strong> {formatTime(scheduleData.time_Scheduled || scheduleData.timeScheduled || '')}</p>
                  <button onClick={() => deleteSchedule(scheduleData.id)} className="delete-btn">Delete</button>
                  <button onClick={() => setEditingId(scheduleData.id)} className="reschedule-btn">Reschedule</button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LookUp