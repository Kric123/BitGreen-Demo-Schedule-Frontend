import { useForm } from "react-hook-form";
import './SchedulePage.css'

function formatTime(timeString: string) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}




function SchedulePage() {
  const { register, handleSubmit, formState:{errors} } = useForm()
  // Handle form submission to create a new schedule
  async function onSubmit(data: any) {
    try {
      const response = await fetch('http://localhost:8080/api/schedules/create', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname: data.firstname,
          lastname: data.lastname,
          phone : data.phone,
          email: data.email,
          date_Scheduled: data.date,
          time_Scheduled: data.time
        })
      });
      const result = await response.json();
      if (response.ok) {
        alert(`Schedule created successfully!\nFirst Name: ${data.firstname}\nLast Name: ${data.lastname}\nEmail: ${data.email}\nPhone: ${data.phone}\nDate: ${data.date}\nTime: ${data.time}`);
      } else {
        alert(`Error: ${result.message || 'Failed to create schedule'}`);
      }
    } catch (error: any) {
      alert(`Network error: ${error.message}`);
    }
  }

  return (
    <div className="schedule-root">
      <h1>Schedule</h1>
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

        <label>
          Email
          <input
            type="email"
            placeholder='Email@gmail.com'
            {...register('email', { required: "Email is required" })}
          />
        </label>
        {errors.email && <span className='error'>Email is required</span>}

        <label>
          Phone
          <input
            type="text"
            placeholder='888-888-8888'
            {...register('phone', { required: "Phone is required" })}
          />
        </label>
        {errors.phone && <span className='error'>Phone is required</span>}

        <label>
          Date
          <input
            type="date"
            {...register('date', { required: "Date is required" })}
          />
        </label>
        {errors.date && <span className='error'>Date is required</span>}

        <label>
          Time
          <select {...register('time', { required: "Time is required" })}>
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i.toString().padStart(2, '0');
              return <option key={hour} value={`${hour}:00`}>{formatTime(`${hour}:00`)}</option>;
            })}
          </select>
        </label>
        {errors.time && <span className='error'>Time is required</span>}

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  )
}

export default SchedulePage