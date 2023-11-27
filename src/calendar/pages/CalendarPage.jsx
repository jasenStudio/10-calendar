import { useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';


import { localizer,getMessages } from "../../helpers"
import { calendarEventBox,CalendarModal,FabAddNew,FabDelete,NavBar } from '../';
import { useUIStore,useCalendarStore, useAuthStore } from '../../hooks';




export const CalendarPage = () => {

  const {user} = useAuthStore();
 const{ events,setActiveEvent,startLoadingEvents,activeEvent } = useCalendarStore();

 const [lastView,SetLastView] = useState(localStorage.getItem('lastView') || 'week' )
 const {openDateModal } = useUIStore();
 const eventStyleGetter = ( event,start,end,isSelected)  => {



  const isMyEvent = ( user.uid === event.user._id) || (user.uid === event.user.uid);

  const style = {
    backgroundColor:isMyEvent ? '#347cf7' : '#465660',
    borderRadius: '0px',
    opacity:0.8,
    color: 'white'
  }

  return {
    style
  }
 }

 const onDoubleClick = ( event ) =>{
  openDateModal();
}

const onSelect = ( event ) =>{
  setActiveEvent(event);
}

const onViewChanged = (event) => {
  localStorage.setItem('lastView',event);
  SetLastView(event);
}

console.log(activeEvent);

useEffect(()=>{
startLoadingEvents();
},[])

  return (
    <>
   <NavBar />

    <Calendar
      culture='es'
      localizer={localizer}
      events={events}
      defaultView={lastView}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 'calc(100vh - 80px )'}}
      messages={ getMessages() }
      eventPropGetter={ eventStyleGetter }
      components={{
        event:calendarEventBox
      }}

      onDoubleClickEvent={ onDoubleClick }
      onSelectEvent={ onSelect }
      onView={ onViewChanged }
    />

    <CalendarModal />
    <FabAddNew />
    <FabDelete />
        
    </>
  )
}
