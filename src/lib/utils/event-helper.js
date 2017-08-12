/* Get new events that works in all target browsers
 * though a little bit old-fashioned
 */
const getEvent = (name, props = {
	bubbles: false,
	cancelable: false
}) => {
	const event = document.createEvent('Event')
	event.initEvent(name, props.bubbles, props.cancelable)
	return event
}

export default getEvent
