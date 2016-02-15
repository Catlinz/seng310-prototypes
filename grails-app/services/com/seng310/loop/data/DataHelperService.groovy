package com.seng310.loop.data

import com.seng310.loop.AgeRestriction
import com.seng310.loop.EntryMethod
import com.seng310.loop.VenueType
import grails.transaction.Transactional

@Transactional
class DataHelperService {

    def venueCreationService;
    def musicEventCreationService;

    def createDefaultVenuesAndShows() {
        def alix = venueCreationService.createAndSaveVenue(
                name: "Alix Goolden Performance Hall",
                description: "The main concert hall is the Alix Goolden Performance Hall, named in honour of Alix Goolden, the woman who contributed so much to the dream of a music conservatory in Victoria. This 800-seat hall has earned a reputation among local music lovers for its fine acoustics and simple elegance.",
                type: VenueType.THEATRE,
                capacity: 814,
                province: "BC", city: "Victoria", address: "907 Pandora Ave", zip: "V8R 1X5",
                lat: 48.427184,
                lng: -123.358297
        )

        def camilles = venueCreationService.createAndSaveVenue(
                name: "Camille's Restaurant",
                description: "Globally Inspired. Local Flavour.",
                type: VenueType.RESTAURANT,
                capacity: 0,
                province: "BC", city: "Victoria", address: "45 Bastion Square",
                lat: 48.425591,
                lng: -123.368728
        )

        def copper = venueCreationService.createAndSaveVenue(
                name: "Copper Owl",
                description: "Arts and music events at a historic bar and lounge above Paul's Motor Inn, including live local and touring bands, art events, dance party nights, performance art and comedy, private parties and more!",
                type: VenueType.BAR_NIGHTCLUB,
                capacity: 120,
                province: "BC", city: "Victoria", address: "1900 Douglas Street",
                lat: 48.431484,
                lng: -123.364925
        )

        def hermanns = venueCreationService.createAndSaveVenue(
                name: "Hermann's Jazz Club",
                description: "The one, the only, Hermann's Jazz Club. Kick back and soak up the sweet sounds.\n\nHermann's has a restaurant license so all ages are welcome.",
                type: VenueType.RESTAURANT,
                capacity: 150,
                province: "BC", city: "Victoria", address: "753 View Street",
                lat: 48.425114,
                lng: -123.362914
        )

        def logans = venueCreationService.createAndSaveVenue(
                name: "Logan's Pub",
                description: "Intimate venue. Live music five nights a week; local and touring acts. Will book just about any genre, focusing on alternative/alt.country/punk (no top 40 or generic cover bands, please).",
                type: VenueType.BAR_NIGHTCLUB,
                capacity: 150,
                province: "BC", city: "Victoria", address: "1821 Cook Street", zip: "V8T 3P5",
                lat: 48.429818,
                lng: -123.352766
        )

        def mybar = venueCreationService.createAndSaveVenue(
                name: "My Bar And Grill",
                description: "A neighbourhood pub that treats everyone like family. Be prepared for a little love and a little abuse. Located on the Gorge in the Howard Johnson Hotel.",
                type: VenueType.PUB,
                capacity: 0,
                province: "BC", city: "Victoria", address: "310 Gorge Rd East",
                lat: 48.443124,
                lng: -123.378679
        )

        def roxy = venueCreationService.createAndSaveVenue(
                name: "The Roxy Theatre",
                description: "Blue Bridge Repertory Theatre is a theatre company in Victoria, British Columbia established in 2008. We felt there was a gap in the Victoria theatre community for productions of great works of the past. Taking advantage of the beautiful and historic McPherson Playhouse in downtown Victoria, our first season in 2009 presented three plays to more than 10,000 spectators and since then our numbers have been steadily growing.\n\nWorking closely with the University of Victoria and other local institutions, we have been able to provide opportunities to students and young professionals right here in BC. To date we have created these opportunities for more than 45 artists in on- and off-stage capacities.\n\nOur pattern of productions has included a great comedy from the likes of Shakespeare, Orton, and Coward, a great drama from heavyweights Miller, Williams, and Albee, and lively classic musicals from The Fantasticks to Hank Williams – the show he never gave.\n\nIn 2013, we acquired the historic Roxy Theatre in the heart of Quadra Village. As we convert this movie theatre into an arts venue for not only Blue Bridge Repertory Theatre`s live performances but for the whole community, we hope that you the opportuity to stop by and come see a show.",
                type: VenueType.THEATRE,
                capacity: 0,
                province: "BC", city: "Victoria", address: "2657 Quadra St", zip: "V8T 4E3",
                lat: 48.43912,
                lng: -123.358721
        )

        def tallyho = venueCreationService.createAndSaveVenue(
                name: "Tally Ho Sports Bar and Grill",
                description: "At the Tallyho Hotel on douglas street. The old Tally Ho Pub",
                type: VenueType.BAR_NIGHTCLUB,
                capacity: 310,
                province: "BC", city: "Victoria", address: "3020 Douglas St",
                lat: 48.443963,
                lng: -123.371105
        )

        def waddling = venueCreationService.createAndSaveVenue(
                name: "The Waddling Dog Bar & Grill",
                type: VenueType.PUB,
                capacity: 0,
                province: "BC", city: "Saanichton", address: "2476 Mount Newton Cross Rd",
                lat: 48.594543,
                lng: -123.396811
        )

        def whiteeagle = venueCreationService.createAndSaveVenue(
                name: "White Eagle Polish Hall",
                description: "The White Eagle Polish Hall is located in beautiful James Bay, just a block away from Ogden Point and minutes away from downtown.\n\nThe Polish Hall has two floors available for a variety of events.\n\nThe Hall offers ample parking on both sides of the building and is a short walk away from the #31 bus route. \n\nPlease contact us to discuss your rental needs and to schedule a tour of the facility.",
                type: VenueType.MULTIPURPOSE_HALL,
                capacity: 0,
                province: "BC", city: "Victoria", address: "90 Dock St", zip: "V8V 2A1",
                lat: 48.416770,
                lng: -123.382460
        )

        def beacon = venueCreationService.createAndSaveVenue(
                name: "Beacon Landing Restaurant & Lounge",
                type: VenueType.RESTAURANT,
                capacity: 0,
                province: "BC", city: "Sidney", address: "2537 Beacon Avenue",
                lat: 48.648697,
                lng: -123.394725
        )

        def bengal = venueCreationService.createAndSaveVenue(
                name: "The Bengal Lounge",
                description: "Lounge in the Empress.",
                type: VenueType.RESTAURANT,
                capacity: 60,
                province: "BC", city: "Victoria", address: "721 Government St", zip:"V8W 1W5",
                lat: 48.421576,
                lng: -123.366741
        )

        def rbcm = venueCreationService.createAndSaveVenue(
                name: "British Columbia Archives, Royal BC Museum",
                type: VenueType.MULTIPURPOSE_HALL,
                capacity: 0,
                province: "BC", city: "Victoria", address: "Royal BC Museum 675 Belleville Street", zip:"V8W 9W2",
                lat: 48.419820,
                lng: -123.367397
        )

        def caleb = venueCreationService.createAndSaveVenue(
                name: "Caleb Pike House",
                type: VenueType.MULTIPURPOSE_HALL,
                capacity: 0,
                province: "BC", city: "Victoria", address: "1589 Millstream Road", zip:"V8W 1W5",
                lat: 48.507756,
                lng: -123.522650
        )

        def christies = venueCreationService.createAndSaveVenue(
                name: "Christie's Carriage House Pub",
                description: "In 1986, a gorgeously restored Christie’s opened for business. Spiffed up in high Edwardian fashion, with dark woods, stained glass, brass rails, a patterned ceiling designed in stamped foil, striped wallpaper and fireplaces - Christie’s accurately recreates the lush comforts that Eldridge and his family knew.\n\nEssentially designed in an open plan, there are several half-walls that create a variety of nooks and crannies that can accommodate various social needs. \n\nIn 1993, due to the popularity of open air patios, Christie’s created a fabulous patio, complete with heaters and a fireplace for Victoria’s mild winters and open to the beautiful sunshine in the summer. \n\nToday, there is always some-thing happening at Christie’s, food or drink specials everyday. The kitchen offers pub classics such as fish and chips or bangers and mash, and more contemporary fare like fresh fish tacos, always with a generous plate of quality food at a reasonable price. Many a beer are on tap - thirty four the last time we counted, representing a wide spectrum of local and regional microbreweries. Or you may prefer one of our unique daily special cocktails.(Happy hour 3 to 6 p.m. everyday) Gluten free menu available.\n\nChristie’s Carriage House Pub recreates turn-of-the-century Victoria with flair, charm and comfort. It is truly the living room of the neighbourhood - a place where friends meet, chat and share good times. Drop in - it's in the neighbourhood.",
                type: VenueType.PUB,
                capacity: 0,
                province: "BC", city: "Victoria", address: "1739 Fort St", zip:"V8R 1J3",
                lat: 48.428716,
                lng: -123.331592
        )

        def evedars = venueCreationService.createAndSaveVenue(
                name: "Evedar's Bistro",
                type: VenueType.RESTAURANT,
                capacity: 0,
                province: "BC", city: "Langford", address: "2829 Peatt Rd",
                lat: 48.448408,
                lng: -123.501018
        )

        def pacific = venueCreationService.createAndSaveVenue(
                name: "Pacific Fleet Club",
                description: "An upscale Canadian Forces club at CFB Esquimalt. Most events are Members only. Public allowed by invitation only.",
                type: VenueType.BAR_NIGHTCLUB,
                capacity: 315,
                province: "BC", city: "Victoria", address: "1587 Lyall Street",
                lat: 48.427099,
                lng: -123.429826
        )

        def standrews = venueCreationService.createAndSaveVenue(
                name: "St. Andrews Presbyterian Church",
                description: "HISTORIC SAINT ANDREWS PRESBYTERIAN CHURCH\nSt. Andrews Presbyterian Church (1910) was built before sound amplification technology became acceptable at public assemblies and consequently the architectural design alone had to project voice (and views) to over 500 parishioners! The sound, site lines, simple stage, wrap around balcony, cushioned pewed seating, ambiance and related music heritage and tradition has proven to be an excellent venue for Mountain Jubilee concerts. \n\nSOMETHING TO CROW ABOUT \nThe Jubilee's also raise awareness towards Oak Bay United Church's status as a condemned building. After an engineering report, the 1914 historic church was declared unsafe for public assembly, was closed, and has consequently been under threat of demolition for the last 13 years. Good news! The congregation of OBUC has embarked on a 3.2 million dollar Capital Campaign to re-build and save its church! One day we'll have big Ole' Mountain Jubilee's in the restored church! In the meantime the Mountain Jubilee MusicEvent audiences continue to support the campaign to save the church and thereby help \"build upon and preserve a modern version of the heritage from which Mountain music grew over 100 years ago!\n\nTHANK YOU \nThe Congregation of OBUC is very thankful for financial support through YOUR drop-box donations, auction item bidding and refreshment purchases at these \"fun\"-raisin' benefits at St Andrews Presbyterian Church. \n\n... Ray France",
                type: VenueType.CHURCH,
                capacity: 0,
                province: "BC", city: "Victoria", address: "924 Douglas Street",
                lat: 48.423781,
                lng: -123.365809
        )

        def farquhar = venueCreationService.createAndSaveVenue(
                name: "University Centre Farquhar Auditorium",
                description: "Overview\n\nPart of the University Centre Farquhar Auditorium's attraction is due to its unique architectural design. Built as part of the eight million dollar University Centre complex designed by the Wade Williams Partnership of Victoria, the Auditorium is the first \"surround\" hall built in Canada. The prime objectives of the facility's design were to provide good acoustics and sightlines from all seats. These objectives were successfully met, evidenced by the Auditorium's national reputation as an acoustic venue. The architectural design is enhanced by the interior's stunning wood lined stage and creative lighting. The beautiful Clearihue organ adds majesty to the environment and has become a tourist attraction in its own right.\n\n\nSeating Plan \n\nFollowing what is known as a `continental' seating plan, the Auditorium seats are placed in unbroken rows. Each row has been spaced one foot farther apart than is conventionally done to allow for ample legroom and comfort. \n\nAcoustics\n\nThe Auditorium was designed to reflect and project sound as cleanly as possible and with this consideration several features have been included in the Auditorium:\nthin vertical ridges finish the walls to reflect high frequency sound waves.",
                type: VenueType.THEATRE,
                capacity: 1051,
                province: "BC", city: "Victoria", address: "University of Victoria, 3800 Finnerty Road",
                lat: 48.463332,
                lng: -123.314645
        )

        def market = venueCreationService.createAndSaveVenue(
                name: "Victoria Public Market at the Hudson",
                description: "There are many great opportunities for the Victoria Public Market as a venue for dynamic off-site events. From cooking classes, to long table dinners, educational seminars, fundraisers, conferences and more, the main event space offers a contemporary space with an agri-chic aesthetic. Each event in the Market is treated individually; some will be intimate private events in the Community Kitchen, others will be ticketed events open to the public.\n\nOur main event space offers a unique venue for gatherings up to 400 plus and the Community Kitchen may be considered for smaller intimate events under 25 guests.",
                type: VenueType.MULTIPURPOSE_HALL,
                capacity: 400,
                province: "BC", city: "Victoria", address: "#6-1701 Douglas St",
                lat: 48.429843,
                lng: -123.363881
        )

        def unitarian = venueCreationService.createAndSaveVenue(
                name: "First Unitarian Church of Victoria",
                type: VenueType.CHURCH,
                capacity: 0,
                province: "BC", city: "Victoria", address: "5575 West Saanich Road",
                lat: 48.533508,
                lng: -123.437443
        )

        def phillip = venueCreationService.createAndSaveVenue(
                name: "Phillip T. Young Recital Hall (UVic)",
                description: "Uvic School of Music recital hall in the Maclaurin B-Wing. Very Nice 220 seat recital hall.",
                type: VenueType.THEATRE,
                capacity: 220,
                province: "BC", city: "Victoria", address: "University of Victoria, 3800 Finnerty Road",
                lat: 48.462535,
                lng: -123.315087
        )

        def lucky = venueCreationService.createAndSaveVenue(
                name: "Lucky Bar",
                description: "Live music of every genre, DJ based club nights, weeklies and one-offs, Lucky plays host to just about every type of event there is. From Pop, Rock, Punk, Metal, Hip Hop, Electronic, Experimental, Folk and Jazz music to Live Theatre, Variety Shows and Film Screenings.",
                type: VenueType.BAR_NIGHTCLUB,
                capacity: 188,
                province: "BC", city: "Victoria", address: "517 Yates Street",
                lat: 48.426756,
                lng: -123.369577
        )

        def bartholomews = venueCreationService.createAndSaveVenue(
                name: "Bartholomew's Pub",
                description: "Bartholomew's English-Style Pub, located at Douglas St. and Humboldt St. in Downtown Victoria, one block from the Inner Harbour. \n\nA Victoria classic since 1975! Featuring live music with rockin' local bands every Friday, Saturday and Sunday evenings (free cover). Offering tasty pub fare, a wide range of local beer on tap and Bart's Signature Double Seafood Caesar. Friendly atmosphere in a classic pub setting with an inviting patio (heated, seasonal). Family friendly for Breakfast, Lunch and Dinner.",
                type: VenueType.PUB,
                capacity: 0,
                province: "BC", city: "Victoria", address: "777 Douglas St", zip: "V8W 2B5",
                lat: 48.421904,
                lng: -123.365553
        )

        def grand = venueCreationService.createAndSaveVenue(
                name: "Hotel Grand Pacific",
                description: "The Hotel Grand Pacific enjoys a reputation as one of the finest five star hotels in British Columbia, Canada.\nLocated in the heart of historic Victoria, the largest city on Vancouver Island, BC, Hotel Grand Pacific offers first-class accommodation and services for our guests - with an extensive range of business meeting, function rooms, banquet, catering, fitness and entertainment facilities.\n\nSet in the inspiring, relaxing surroundings of Victoria's Inner Harbor, we are adjacent to the Parliament Buildings and within strolling distance of the myriad of boutiques, museums, galleries and cafes of historic Old Town and Antique Row, as well as all the amenities in downtown Victoria.",
                type: VenueType.RESTAURANT,
                capacity: 0,
                province: "BC", city: "Victoria", address: "463 Belleville Street",
                lat: 48.420682,
                lng: -123.372434
        )

        def oakbay = venueCreationService.createAndSaveVenue(
                name: "Upstairs Lounge - Recreation Oak Bay",
                type: VenueType.MULTIPURPOSE_HALL,
                capacity: 0,
                province: "BC", city: "Victoria", address: "1975 Bee Street",
                lat: 48.430895,
                lng: -123.320819
        )

        def atrium = venueCreationService.createAndSaveVenue(
                name: "The Atrium",
                type: VenueType.IRREGULAR_VENUE,
                capacity: 0,
                province: "BC", city: "Victoria", address: "800 Yates Street",
                lat: 48.426303,
                lng: -123.361413
        )

        def dickens = venueCreationService.createAndSaveVenue(
                name: "Charles Dickens Pub",
                type: VenueType.PUB,
                capacity: 152,
                province: "BC", city: "Sidney", address: "2250 Beacon Avenue",
                lat: 48.648720,
                lng: -123.394722
        )

        def gabys = venueCreationService.createAndSaveVenue(
                name: "Gaby's Seaside Restaurant and Pub",
                description: "Gaby's Seaside Restaurant had its first official opening on March 1, 2014. You have to come down to check it out. It has a great view for all, right on the water. We are currently re vamping the menu, once we have it finalized we will post in on here, but in the meantime come on by for Breakfast, lunch or dinner You will love the place and the friendly staff they have working there will make you feel right at home.\n\nThere is also a full bar for those that enjoy a nice glass of wine or beer, and they also have other drinks on the menu as well.\n\nHope to see you all there!!",
                type: VenueType.PUB,
                capacity: 0,
                province: "BC", city: "Victoria", address: "453 Head St",
                lat: 48.426298,
                lng: -123.398031
        )

        def sugar = venueCreationService.createAndSaveVenue(
                name: "Sugar",
                description: "Victoria's premiere live music venue, hosting numerous touring acts, as well as local shows and events.\nTickets for all shows are available at Lyle's Place (770 Yates Street)\nAll enquiries, please e-mail info@sugarnightclub.ca",
                type: VenueType.BAR_NIGHTCLUB,
                capacity: 600,
                province: "BC", city: "Victoria", address: "858 Yates Street", zip: "V8W 1L8",
                lat: 48.425958,
                lng: -123.359842
        )

        def scientist = venueCreationService.createAndSaveVenue(
                name: "First Church of Christ Scientist",
                type: VenueType.CHURCH,
                capacity: 0,
                province: "BC", city: "Victoria", address: "1205 Pandora Ave",
                lat: 48.426847,
                lng: -123.350068
        )

        def gorgeous = venueCreationService.createAndSaveVenue(
                name: "Gorge-ous Coffee",
                type: VenueType.CAFE,
                capacity: 0,
                province: "BC", city: "Victoria", address: "300 Gorge Road",
                lat: 48.44798,
                lng: -123.40104
        )

        def oswego = venueCreationService.createAndSaveVenue(
                name: "Oswego Hotel's O Bistro",
                type: VenueType.RESTAURANT,
                capacity: 0,
                province: "BC", city: "Victoria", address: "500 Oswego Street", zip: "V8V 5C1",
                lat: 48.420695,
                lng: -123.37563
        )

        def cambie = venueCreationService.createAndSaveVenue(
                name: "The Cambie at the Esquimalt Inn",
                description: "The Cambie Esquimalt aims to be Victorias number one destination for live music and events. We offer a static calendar across many genres, including Ladies' Night on Mondays, Open Mic Night on Tuesdays, Hot House Pizza Party on Wednesdays, Karaoke on Thursdays, awesome live bands and upcoming local talent on Fridays and Saturdays and Punk Rock Bingo on Sundays.",
                type: VenueType.BAR_NIGHTCLUB,
                capacity: 172,
                province: "BC", city: "Victoria", address: "856 Esquimalt Road", zip: "V9A 3M4",
                lat: 48.431768,
                lng: -123.3987
        )

        def spectrum = venueCreationService.createAndSaveVenue(
                name: "Spectrum Community Theatre",
                description: "At Spectrum High School.\n\nOverview\n284 seats or 212 seats with orchestra pit \n1698 square foot floor space (with house out) \n1377 square foot sprung proscenium stage (27' x 51') (14' clearance) \n706 square foot loading by \ncomplete stage drapery system, including cyclorama \nmen's and women's change rooms with showers \nfull public washroom facilities \nclose access to school cafeteria and kitchen \ncentrally located in the Capital Regional District (location information) \nample parking and nearby access to public trans",
                type: VenueType.THEATRE,
                capacity: 284,
                province: "BC", city: "Victoria", address: "957 Burnside Road W",
                lat: 48.462983,
                lng: -123.407650
        )





        def e0 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Booker T. Jones - Black History Month Celebration",
                venue: alix, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "12/02/2016 19:30")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e0, ticket: [[cost: 45]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Spanish Guitarist Live Every Friday Night! Monte Saatchi",
                venue: camilles, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "12/02/2016 18:30"),
                end: Date.parse("d/M/yyyy H:m", "12/02/2016 21:30"),
                isFreeEvent: true
        )

        def e2 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Wicked Wench Aquarius Affair DJ Yeezy Yee",
                venue: copper, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "12/02/2016 20:00"),
                end: Date.parse("d/M/yyyy H:m", "13/02/2016 02:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e2, door: [[cost: 10]])

        def e3 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Valentine's Double Bill Craig Henderson, Susannah Adams",
                venue: hermanns, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "12/02/2016 19:30")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e3, door: [[cost: 15]])

        def e4 = musicEventCreationService.createAndSaveMusicEvent(
                name: "The Generators, THE MANDLEBAUMS, The Poor Choices",
                venue: logans, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "12/02/2016 22:00"),
                end: Date.parse("d/M/yyyy H:m", "13/02/2016 00:45")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e4, door: [[cost: 12]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Dave Harris",
                venue: mybar, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "12/02/2016 21:00"),
                isFreeEvent: true
        )

        def e6 = musicEventCreationService.createAndSaveMusicEvent(
                name: "The Lonely - A Tribute to Roxy Orbison Mike Demers",
                venue: roxy, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "12/02/2016 19:00"),
                end: Date.parse("d/M/yyyy H:m", "12/02/2016 21:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e6, ticket: [[cost: 30.25], [cost: 35.50]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Consenting Adults",
                venue: tallyho, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "12/02/2016 21:00")
        )

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Acoustic show Pulse Radio",
                venue: waddling, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "12/02/2016 19:00"),
                end: Date.parse("d/M/yyyy H:m", "12/02/2016 22:00"),
                isFreeEvent: true
        )

        def e9 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Friday Night Dance Petunia and the Vipers, Petunia petunia, Marc Atkinson Trio",
                venue: whiteeagle, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "12/02/2016 20:00"),
                end: Date.parse("d/M/yyyy H:m", "13/02/2016 00:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e9, ticket: [[cost: 30.25, note: "early Bird"], [cost: 35.50, note: "advance"]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Edie DaPonte, Joey Smith",
                venue: beacon, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "13/02/2016 18:00")
        )

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Lust Life Jazz Band Plays The Bengal Lounge",
                venue: bengal, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "13/02/2016 19:30"),
                end: Date.parse("d/M/yyyy H:m", "13/02/2016 22:30"),
                isFreeEvent: true
        )

        def e13 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Night Shift: Wild Romance",
                venue: rbcm, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "13/02/2016 20:00"),
                end: Date.parse("d/M/yyyy H:m", "14/02/2016 00:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e13, ticket: [[cost: 35]])

        def e14 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Celtic Reflections, also open stage, Ray Spencer, Randall Cook, Anne Waters",
                venue: caleb, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "13/02/2016 19:30"),
                end: Date.parse("d/M/yyyy H:m", "13/02/2016 21:30")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e14, door: [[cost: 5]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Mr. Big Steve (Johnny Cash Tribute)",
                venue: christies, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "13/02/2016 19:30"),
                end: Date.parse("d/M/yyyy H:m", "13/02/2016 22:30"),
                isFreeEvent: true
        )

        def e16 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Strictly Roots & Clean Heart Youth present The Heart Breakers Ball, Heart & Soul Edition Dj Lexus , Dj Shell, Dj KNatural",
                venue: copper, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "13/02/2016 21:00"),
                end: Date.parse("d/M/yyyy H:m", "14/02/2016 02:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e16, ticket: [[cost: 10, note: "ADV"]], door: [[cost: 12, note: "DOOR"]])

        def e17 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Maureen Washington, Karel Roessingh, Damian Graham, Sean Drabitt",
                venue: evedars, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "13/02/2016 17:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e17, general: [[cost: 45, note: "per person, plus tax and 18% automatic gratuity"]])

        def e18 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Valentine with the Blues Auntie Kate & the Uncles of Funk",
                venue: hermanns, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "13/02/2016 20:00"),
                end: Date.parse("d/M/yyyy H:m", "13/02/2016 23:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e18, door: [[cost: 5]])

        def e19 = musicEventCreationService.createAndSaveMusicEvent(
                name: "The Great American Songbook Trio - Valentines Special Louise Rose, Joey Smith, Kelby MacNayr",
                venue: hermanns, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "13/02/2016 14:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e19, door: [[cost: 20], [cost: 18, note: "UJam/VJS"], [cost: 10, note: "student"]])

        def e20 = musicEventCreationService.createAndSaveMusicEvent(
                name: "David Bowie Live Tribute! DEAD OR ALIVE",
                venue: logans, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "13/02/2016 21:00"),
                end: Date.parse("d/M/yyyy H:m", "14/02/2016 1:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e20, door: [[cost: 10]])

        def e21 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Valentine's Dance",
                venue: pacific, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "13/02/2016 21:00"),
                end: Date.parse("d/M/yyyy H:m", "14/02/2016 00:45")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e21, door: [[cost: 5]])

        def e22 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Saturday Concert and Dance",
                venue: standrews, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "13/02/2016 20:00"),
                end: Date.parse("d/M/yyyy H:m", "14/02/2016 01:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e22, ticket: [[cost: 35, note: "Early Bird"], [cost: 40, note: "Advance"]])

        def e23 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Sweet Heart Swirl",
                venue: tallyho, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "13/02/2016 20:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e23, ticket: [[cost: 15, note: "Advance"]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Mark Comerford",
                venue: tallyho, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "13/02/2016 20:00")
        )

        def e25 = musicEventCreationService.createAndSaveMusicEvent(
                name: "The Paperboys",
                venue: farquhar, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "13/02/2016 19:30")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e25, ticket: [[cost: 26, note: "Advance"]], door: [[cost: 28, note: "at the door"]])

        def e26 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Mardi Gras",
                venue: market, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "13/02/2016 19:00"),
                end: Date.parse("d/M/yyyy H:m", "13/02/2016 23:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e26, ticket: [[min: 45, max: 80]])

        def e27 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Jazz Vespers (Spirited Jazz)",
                venue: unitarian, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "14/02/2016 19:00"),
                end: Date.parse("d/M/yyyy H:m", "14/02/2016 20:15")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e27, byDonation: [[:]])

        def e28 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Valentines Dinner",
                venue: hermanns, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "14/02/2016 18:00"),
                end: Date.parse("d/M/yyyy H:m", "14/02/2016 21:30")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e28, ticket: [[cost: 75, note: "Early Bird"], [cost: 80, note: "Advance"]])

        def e29 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Mulan-Percussion Musical",
                venue: farquhar, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "14/02/2016 20:00"),
                end: Date.parse("d/M/yyyy H:m", "14/02/2016 21:30")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e29, ticket: [[min: 40, max: 60]])

        def e30 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Share the Love!",
                venue: hermanns, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "15/02/2016 19:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e30, door: [[min: 12, max: 20]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Guest Concert",
                venue: phillip, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "15/02/2016 20:00"),
                isFreeEvent: true
        )

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Purl Jam",
                venue: copper, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "16/02/2016 20:00"),
                end: Date.parse("d/M/yyyy H:m", "16/02/2016 23:00"),
                isFreeEvent: true
        )

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Extra Solar Planets",
                venue: hermanns, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "16/02/2016 18:30"),
                isFreeEvent: true
        )

        def e34 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Tuesdaymusic",
                venue: phillip, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "16/02/2016 12:30")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e34, byDonation: [[:]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "The Rabbit Hole with",
                venue: copper, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "17/02/2016 18:00"),
                end: Date.parse("d/M/yyyy H:m", "17/02/2016 21:00"),
                isFreeEvent: true
        )

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Records and Cocktails",
                venue: copper, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "17/02/2016 21:00"),
                isFreeEvent: true
        )

        def e37 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Carol Sings Harold & Carol",
                venue: hermanns, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "17/02/2016 19:30")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e37, door: [[cost: null]])

        def e38 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Matt Andersen",
                venue: farquhar, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "17/02/2016 19:30"),
                coverNote: "(plus service charges)"
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e38, ticket: [[cost: 39], [cost: 31], [cost: 23]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Maureen Washington, Karel Roessingh",
                venue: bengal, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "18/02/2016 19:00"),
                isFreeEvent: true
        )

        def e40 = musicEventCreationService.createAndSaveMusicEvent(
                name: "GNUMADAYO Deep Tropical House DANCE PARTY!",
                venue: copper, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "18/02/2016 21:00"),
                entry: EntryMethod.DOOR, cost: "\$5"
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e40, door: [[cost: 5]])

        def e41 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Jazz Jam",
                venue: hermanns, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "18/02/2016 20:00"),
                coverNote: "free after 10pm"
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e41, door: [[cost: 8], [cost: 5, note: "students"]])

        def e42 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Wise Child, The Orphans, Iron Skies",
                venue: logans, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "18/02/2016 21:00"),
                end: Date.parse("d/M/yyyy H:m", "19/02/2016 00:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e42, door: [[cost: 8]])

        def e43 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Greazu\$, X/L B2B Guests, KIRTAY",
                venue: lucky, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "18/02/2016 22:00"),
                end: Date.parse("d/M/yyyy H:m", "19/02/2016 02:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e43, ticket: [[cost: 8]])

        def e44 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Coeur de pirate (**SOLD OUT**), Fox Glove",
                venue: alix, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "19/02/2016 19:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e44, ticket: [[cost: 29.50]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Kooler",
                venue: bartholomews, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "19/02/2016 21:00")
        )

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Spanish Guitarist Live Every Friday Night! Monte Saatchi",
                venue: camilles, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "19/02/2016 18:30"),
                end: Date.parse("d/M/yyyy H:m", "19/02/2016 21:30"),
                isFreeEvent: true
        )

        def e47 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Cosmic Leap Year Get Down",
                venue: copper, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "19/02/2016 21:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e47, door: [[cost: 10]])

        def e48 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Forty Roses, Tina Jones",
                venue: hermanns, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "19/02/2016 20:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e48, door: [[cost: 20]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Maureen Washington, Karel Roessingh",
                venue: grand, age: AgeRestriction.NO_RESTRICTION,
                isFreeEvent: true
        )

        def e50 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Scimitar, Iron Kingdom, Tribune, Maiden BC",
                venue: logans, age: AgeRestriction.NO_RESTRICTION
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e50, general: [[cost: 20, note: "Advanced 2 Day Pass"], [cost: 12.50, note: "Advanced 1 Day Pass"]], door: [[cost: 15, note: "1 Day Door Price"]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Roots Rock Rodeo - Country Night!",
                venue: mybar, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "19/02/2016 21:00"),
                isFreeEvent: true
        )

        def e52 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Fridaymusic",
                venue: phillip, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "19/02/2016 12:30"),
                entry: EntryMethod.DONATION
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e52, byDonation: [[:]])

        def e53 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Faculty Concert",
                venue: phillip, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "19/02/2016 20:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e53, general: [[cost: 18, note: "Adults"], [cost: 14, note: "Seniors, students & alumni"]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Xlr8",
                venue: tallyho, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "19/02/2016 21:00")
        )

        def e55 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Lynn Miles, Keith Glass",
                venue: oakbay, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "19/02/2016 19:30"),
                end: Date.parse("d/M/yyyy H:m", "19/02/2016 22:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e55, ticket: [[cost: 15, note: "advance"]], door: [[cost: 20, note: "at the door"]])

        def e56 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Local Love: Oaklands Sunset Market Fundraiser!",
                venue: atrium, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "20/02/2016 19:00"),
                end: Date.parse("d/M/yyyy H:m", "20/02/2016 23:30")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e56, ticket: [[cost: 20]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Kooler",
                venue: bartholomews, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "20/02/2016 21:00")
        )

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Lust Life Jazz Band Plays The Bengal Lounge",
                venue: bengal, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "20/02/2016 19:30"),
                end: Date.parse("d/M/yyyy H:m", "20/02/2016 22:30"),
                isFreeEvent: true
        )

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Johnny Cash Tribute",
                venue: dickens, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "20/02/2016 22:00"),
                end: Date.parse("d/M/yyyy H:m", "21/02/2016 02:00"),
                isFreeEvent: true
        )

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Undertow",
                venue: christies, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "20/02/2016 19:30"),
                end: Date.parse("d/M/yyyy H:m", "21/02/2016 22:30"),
                isFreeEvent: true
        )

        def e61 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Jack Garton, The Burnettes, Carolyn Mark and her new Best Friends",
                venue: copper, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "20/02/2016 21:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e61, door: [[cost: 10]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Jazz by the Seaside",
                venue: gabys, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "20/02/2016 19:00"),
                end: Date.parse("d/M/yyyy H:m", "20/02/2016 21:30"),
                isFreeEvent: true
        )

        def e63 = musicEventCreationService.createAndSaveMusicEvent(
                name: "The Music of Art Blakey's Jazz Messengers feat. special guest Ian McDougall",
                venue: hermanns, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "20/02/2016 20:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e63, door: [[cost: 20], [cost: 18, note: "VJS"], [cost: 15, note: "Stud"]])

        def e64 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Bourbon Street to Broadway",
                venue: hermanns, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "20/02/2016 14:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e64, door: [[min: 10, max: 20]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Maureen Washington, Karel Roessingh",
                venue: grand, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "20/02/2016 20:00"),
                isFreeEvent: true
        )

        def e66 = musicEventCreationService.createAndSaveMusicEvent(
                name: "The Sheepdogs (**SOLD OUT**), Guests",
                venue: sugar, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "20/02/2016 19:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e66, ticket: [[cost: 30]])

        def e67 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Fernwood Soccer Association Fundraiser",
                venue: tallyho, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "20/02/2016 21:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e67, ticket: [[cost: 10]])

        def e68 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Sunday Series - feat. Richard Bird and MORE!",
                venue: hermanns, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "21/02/2016 19:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e68, door: [[cost: 18], [cost: 15], [cost: 12]])

        def e69 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Dixieland & Swing with CanUS Jazz Band",
                venue: hermanns, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "21/02/2016 15:00"),
                end: Date.parse("d/M/yyyy H:m", "21/02/2016 18:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e69, door: [[cost: 12]])

        def e70 = musicEventCreationService.createAndSaveMusicEvent(
                name: "The Flying Saucers",
                venue: hermanns, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "22/02/2016 19:30")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e70, door: [[cost: 10]])

        def e71 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Riverside Bluegrass Band",
                venue: scientist, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "23/02/2016 19:45"),
                end: Date.parse("d/M/yyyy H:m", "23/02/2016 22:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e71, door: [[cost: 7]])

        def e72 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Monik Nordine",
                venue: hermanns, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "23/02/2016 19:30")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e72, door: [[cost: 12], [cost: 8, note: "students"]])

        def e73 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Tuesdaymusic",
                venue: phillip, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "23/02/2016 12:30")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e73, byDonation: [[:]])

        def e74 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Monster Truck, The Temperance Movement",
                venue: sugar, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "23/02/2016 20:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e74, ticket: [[cost: 32.50]])

        def e75 = musicEventCreationService.createAndSaveMusicEvent(
                name: "A Twin Peaks Evening",
                venue: copper, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "24/02/2016 21:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e75, ticket: [[cost: 10]])

        def e76 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Raine and Shauna",
                venue: gorgeous, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "24/02/2016 19:30"),
                end: Date.parse("d/M/yyyy H:m", "24/02/2016 21:30")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e76, byDonation: [[suggested: 15]])

        def e77 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Tease Cabaret Miss Rosie Bitts",
                venue: hermanns, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "24/02/2016 19:30")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e77, ticket: [[cost: null]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Jazz at the O Bistro",
                venue: oswego, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "24/02/2016 18:00"),
                end: Date.parse("d/M/yyyy H:m", "24/02/2016 20:00")
        )

        def e79 = musicEventCreationService.createAndSaveMusicEvent(
                name: "\"NIGHT TIME KILL\" TOUR",
                venue: tallyho, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "24/02/2016 21:30"),
                end: Date.parse("d/M/yyyy H:m", "25/02/2016 01:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e79, ticket: [[cost: 25]])

        def e80 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Iron Kingdom, Fractured Anatomy",
                venue: cambie, age: AgeRestriction.NO_MINORS,
                entry: EntryMethod.DOOR, cost: "\$10.00"
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e80, door: [[cost: 10]])

        def e81 = musicEventCreationService.createAndSaveMusicEvent(
                name: "RIP Ian Fraser \"Lemmy\" Kilmister 1945-2015 a tribute fundraiser",
                venue: copper, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "25/02/2016 21:30")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e81, door: [[cost: null]])

        def e82 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Jazz Jam Tom Vickery Trio",
                venue: hermanns, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "25/02/2016 20:00"),
                coverNote: "Free after 10pm"
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e82, door: [[cost: 8], [cost: 5, note: "students"]])

        def e83 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Beautiful Music by an Unknown Composer",
                venue: phillip, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "25/02/2016 12:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e83, byDonation: [[:]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Pulse Radio",
                venue: bartholomews, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "26/02/2016 21:00"),
                end: Date.parse("d/M/yyyy H:m", "27/02/2016 01:00")
        )

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Spanish Guitarist Live Every Friday Night! Monte Saatchi",
                venue: camilles, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "26/02/2016 18:30"),
                end: Date.parse("d/M/yyyy H:m", "26/02/2016 21:30"),
                isFreeEvent: true
        )

        def e86 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Lifted with Jon Lee, J. Feud, Matterson",
                venue: copper, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "26/02/2016 21:00"),
                costNotes: "TBA"
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e86, door: [[cost: null]])

        def e87 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Jazz Doubleshot at Hermann's",
                venue: hermanns, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "26/02/2016 20:00"),
                end: Date.parse("d/M/yyyy H:m", "26/02/2016 23:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e87, door: [[cost: 20]])

        musicEventCreationService.createAndSaveMusicEvent(
                name: "Maureen Washington, Karel Roessingh",
                venue: grand, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "26/02/2016 20:00"),
                isFreeEvent: true
        )

        def e89 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Fridaymusic",
                venue: phillip, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "26/02/2016 12:30")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e89, byDonation: [[:]])

        def e90 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Student Composers Concert",
                venue: phillip, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "26/02/2016 20:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e90, byDonation: [[:]])

        def e91 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Mary Poppins (The Broadway Musical)",
                venue: spectrum, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "26/02/2016 20:00"),
                entry: EntryMethod.TICKET, cost: "\$12/\$10"
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e91, ticket: [[cost: 12], [cost: 10]])

        def e92 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Classified (**SOLD OUT**), Sonreal",
                venue: sugar, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "26/02/2016 21:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e92, ticket: [[cost: 28.50]])

        def e93 = musicEventCreationService.createAndSaveMusicEvent(
                name: "Roxxlyde, Rock Of Ages",
                venue: sugar, age: AgeRestriction.NO_MINORS,
                start: Date.parse("d/M/yyyy H:m", "26/02/2016 21:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e93, door: [[cost: 10]])

        def e94 = musicEventCreationService.createAndSaveMusicEvent(
                name: "The Crooked Brothers The Croked Brothers",
                venue: oakbay, age: AgeRestriction.NO_RESTRICTION,
                start: Date.parse("d/M/yyyy H:m", "26/02/2016 19:30"),
                end: Date.parse("d/M/yyyy H:m", "26/02/2016 22:00")
        )
        musicEventCreationService.createAndSaveMusicEventCoverCharges(event: e94, ticket: [[cost: 15, note: "advance"]], door: [[cost: 20, note: "at the door"]])
    }
}
