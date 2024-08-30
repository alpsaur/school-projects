import '../css/EventSmall.css'

interface Props{
    Img : string
    Title:string
    Start:string

}

function EventSmall({Img,Title,Start}:Props){
    return(
      <>
          <div className="event-small-card">
              <img src={Img} alt="event-photo" className='img'/>
              <div className="textBox">
                  <div className="textContent">
                      <p className="event-title">{Title}</p>
                  </div>
                  <p className="p">Start Date: {Start.substring(0,10)}</p>
                  <div>
                  </div>
              </div>
          </div>
      </>
    );
}

export default EventSmall