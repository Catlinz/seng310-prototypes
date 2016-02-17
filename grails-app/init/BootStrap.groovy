import com.seng310.loop.json.CustomJSONMarshallers

class BootStrap {

    def dataHelperService

    def init = { servletContext ->
        CustomJSONMarshallers.register()

        dataHelperService.createDefaultVenuesAndShows()
        dataHelperService.shiftMusicEventDates();
    }
    def destroy = {
    }
}
