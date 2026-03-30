import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Adding March events and blog images...");

  // Get admin user for posts
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) throw new Error("No admin user found - run main seed first");

  // -------------------------------------------------------------------------
  // March 2026 Events (so calendar view populates for current month)
  // -------------------------------------------------------------------------
  const marchEvents = [
    {
      title: "Weekly Troop Meeting — Knot Tying Skills",
      slug: "weekly-meeting-mar-3-2026",
      description:
        "Regular Tuesday troop meeting at Black Mountain Presbyterian Church. This week: advanced knot tying and lashing practice. Scouts should bring their own rope if they have it. New scouts are always welcome — come in Class A uniform.",
      location: "Black Mountain Presbyterian Church, 117 Montreat Rd, Black Mountain, NC",
      startDate: new Date("2026-03-03T19:00:00-05:00"),
      endDate: new Date("2026-03-03T20:30:00-05:00"),
      allDay: false,
      category: "MEETING" as const,
      published: true,
    },
    {
      title: "Patrol Leaders' Council",
      slug: "plc-mar-8-2026",
      description:
        "Monthly Patrol Leaders' Council meeting to plan upcoming activities. All patrol leaders, the SPL, and ASPL are expected to attend. We will finalize plans for the March campout and discuss the spring service project.",
      location: "Black Mountain Presbyterian Church, 117 Montreat Rd, Black Mountain, NC",
      startDate: new Date("2026-03-08T15:00:00-05:00"),
      endDate: new Date("2026-03-08T16:30:00-05:00"),
      allDay: false,
      category: "MEETING" as const,
      published: true,
    },
    {
      title: "Weekly Troop Meeting — First Aid Review",
      slug: "weekly-meeting-mar-10-2026",
      description:
        "First aid skills refresher in preparation for the upcoming campout. Scouts working on First Aid merit badge should bring their blue cards. We will practice splinting, wound care, and emergency carries.",
      location: "Black Mountain Presbyterian Church, 117 Montreat Rd, Black Mountain, NC",
      startDate: new Date("2026-03-10T19:00:00-05:00"),
      endDate: new Date("2026-03-10T20:30:00-05:00"),
      allDay: false,
      category: "MEETING" as const,
      published: true,
    },
    {
      title: "Craggy Gardens Day Hike",
      slug: "craggy-gardens-hike-mar-14-2026",
      description:
        "Day hike along the Craggy Gardens Trail on the Blue Ridge Parkway. This moderate 4-mile round trip hike features stunning views of the Black Mountain range. Meet at the church at 8:00 AM for carpooling. Bring lunch, water (2 liters minimum), rain gear, and wear sturdy hiking boots. We will return by 3:00 PM.",
      location: "Craggy Gardens, Blue Ridge Parkway, NC",
      startDate: new Date("2026-03-14T08:00:00-05:00"),
      endDate: new Date("2026-03-14T15:00:00-05:00"),
      allDay: false,
      category: "CAMPOUT" as const,
      published: true,
    },
    {
      title: "Weekly Troop Meeting — Orienteering",
      slug: "weekly-meeting-mar-17-2026",
      description:
        "Orienteering practice with compass and topographic maps. Scouts will practice taking bearings, reading contour lines, and navigating a short course around the church grounds. Bring your own compass if you have one.",
      location: "Black Mountain Presbyterian Church, 117 Montreat Rd, Black Mountain, NC",
      startDate: new Date("2026-03-17T19:00:00-04:00"),
      endDate: new Date("2026-03-17T20:30:00-04:00"),
      allDay: false,
      category: "MEETING" as const,
      published: true,
    },
    {
      title: "Montreat Trail Cleanup Service Day",
      slug: "montreat-trail-cleanup-mar-21-2026",
      description:
        "Spring service project clearing winter debris from trails in the Montreat Wilderness. Scouts will clear downed branches, repair water bars, and blaze trail markers. This counts toward service hours for rank advancement. Bring work gloves, water, and lunch. Tools provided.",
      location: "Montreat Conference Center, Montreat, NC",
      startDate: new Date("2026-03-21T09:00:00-04:00"),
      endDate: new Date("2026-03-21T14:00:00-04:00"),
      allDay: false,
      category: "SERVICE" as const,
      published: true,
    },
    {
      title: "Weekly Troop Meeting — Cooking Skills",
      slug: "weekly-meeting-mar-24-2026",
      description:
        "Outdoor cooking demonstration and practice. Each patrol will plan and prepare a simple camp meal using backpacking stoves. Scouts working on Cooking merit badge can complete requirements. Don't forget your mess kits!",
      location: "Black Mountain Presbyterian Church, 117 Montreat Rd, Black Mountain, NC",
      startDate: new Date("2026-03-24T19:00:00-04:00"),
      endDate: new Date("2026-03-24T20:30:00-04:00"),
      allDay: false,
      category: "MEETING" as const,
      published: true,
    },
    {
      title: "Mount Mitchell Weekend Campout",
      slug: "mount-mitchell-campout-mar-27-2026",
      description: `Join Troop 42 for a weekend campout near Mount Mitchell, the highest peak east of the Mississippi! This is a cold-weather camping experience at elevation.

Itinerary:
• Friday: Depart church at 5:00 PM, set up camp at South Toe River
• Saturday: Summit hike on Mount Mitchell Trail (5.6 miles round trip), evening campfire program
• Sunday: Break camp and return by noon

Requirements: Scouts must have completed Second Class rank. Cold-weather sleeping gear required (bag rated to 15°F). See the packing list on our website. Permission slips due at the March 24 meeting.`,
      location: "Mount Mitchell State Park, Burnsville, NC",
      startDate: new Date("2026-03-27T17:00:00-04:00"),
      endDate: new Date("2026-03-29T12:00:00-04:00"),
      allDay: false,
      category: "CAMPOUT" as const,
      published: true,
    },
    {
      title: "Board of Review",
      slug: "board-of-review-mar-31-2026",
      description:
        "Rank advancement Board of Review. Scouts who have completed all requirements for their next rank should sign up with their Scoutmaster. Bring your scout handbook with signed-off requirements. Class A uniform required. Boards begin at 6:30 PM and run every 20 minutes.",
      location: "Black Mountain Presbyterian Church, 117 Montreat Rd, Black Mountain, NC",
      startDate: new Date("2026-03-31T18:30:00-04:00"),
      endDate: new Date("2026-03-31T20:30:00-04:00"),
      allDay: false,
      category: "SPECIAL" as const,
      published: true,
    },
  ];

  for (const event of marchEvents) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    });
  }
  console.log(`Created ${marchEvents.length} March events`);

  // -------------------------------------------------------------------------
  // Update existing blog posts with featured images (Unsplash)
  // -------------------------------------------------------------------------
  const imageUpdates: Record<string, string> = {
    "spring-camporee-lake-james-2026":
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=400&fit=crop",
    "scoutmasters-corner-building-character":
      "https://images.unsplash.com/photo-1475483768296-6163e08872a1?w=800&h=400&fit=crop",
    "three-eagle-scouts-2026":
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=400&fit=crop",
    "summer-camp-registration-2026":
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=400&fit=crop",
  };

  for (const [slug, imageUrl] of Object.entries(imageUpdates)) {
    await prisma.post.update({
      where: { slug },
      data: { featuredImage: imageUrl },
    });
  }
  console.log(`Updated ${Object.keys(imageUpdates).length} posts with featured images`);

  // -------------------------------------------------------------------------
  // Add more blog posts with images
  // -------------------------------------------------------------------------
  const newPosts = [
    {
      title: "Winter Camping at Max Patch — A True Test of Grit",
      slug: "winter-camping-max-patch-2026",
      content: `<h2>Braving the Cold on the Appalachian Trail</h2>
<p>Last month, twelve brave scouts and four adult leaders headed to Max Patch, one of the most iconic balds on the Appalachian Trail, for our annual winter camping trip. With temperatures dropping to 18°F overnight, this was a true test of preparation and determination.</p>
<p>The scouts set up camp in a sheltered area just below the summit, using four-season tents and cold-weather sleeping systems. After a warm dinner of chili and cornbread cooked over patrol stoves, we gathered around a roaring campfire and watched the sun set behind the Great Smoky Mountains — a 360-degree panorama that never gets old.</p>
<h3>Lessons Learned</h3>
<ul>
<li>Layering is everything — several scouts learned the hard way that cotton kills</li>
<li>Hot water bottles in sleeping bags make a huge difference</li>
<li>Snow on the ground made tracking wildlife prints a highlight</li>
<li>Breaking camp in freezing temps builds serious teamwork</li>
</ul>
<p>Every scout who attended earned a night toward their Camping merit badge's winter camping requirement. More importantly, they proved to themselves that they can handle whatever nature throws at them. That kind of confidence doesn't come from a classroom.</p>`,
      excerpt:
        "Twelve scouts brave 18°F temperatures at Max Patch on the Appalachian Trail for our annual winter camping adventure.",
      category: "BLOG" as const,
      published: true,
      featuredImage: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&h=400&fit=crop",
    },
    {
      title: "Scoutmaster's Corner: The Value of Getting Lost",
      slug: "scoutmasters-corner-getting-lost",
      content: `<p>Dear Troop 42 Families,</p>
<p>Last Saturday on our day hike, something wonderful happened: our lead patrol took a wrong turn on the trail. They missed a blaze, followed a game trail for about a quarter mile, and realized they were off course.</p>
<p>Here is what did NOT happen: no one panicked. No one blamed anyone else. No one pulled out a phone to call for help.</p>
<p>Instead, I watched our Patrol Leader pull out his compass, orient his map, identify a landmark ridge line, and lead his patrol back to the main trail in under twenty minutes. He did exactly what we have been practicing at Tuesday meetings, and he did it under real conditions with real consequences.</p>
<p>In our safety-obsessed culture, we sometimes forget that controlled adversity is one of the greatest teachers. Getting a little lost — within a safe framework, with trained leaders nearby — teaches navigation skills that no app can replace. It teaches scouts to trust their training, to stay calm, and to problem-solve as a team.</p>
<p>That patrol walked a little taller for the rest of the hike. They earned something that day that I could never hand them in a meeting room.</p>
<p>So the next time your scout comes home muddy, tired, and grinning — know that they probably learned something that will serve them for life.</p>
<p>See you on the trail,<br/>Scoutmaster Johnson</p>`,
      excerpt:
        "Scoutmaster Johnson reflects on why getting a little lost on the trail is one of the best learning experiences Scouting offers.",
      category: "SCOUTMASTER_NOTE" as const,
      published: true,
      featuredImage: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&h=400&fit=crop",
    },
    {
      title: "Merit Badge Weekend Recap: 15 Badges Earned!",
      slug: "merit-badge-weekend-recap-2026",
      content: `<h2>A Productive Weekend of Learning</h2>
<p>Our annual Merit Badge Weekend at Camp Grier was a huge success, with scouts earning a combined 15 merit badges across eight different subjects. This intensive two-day event brings in expert counselors from across the Daniel Boone Council to help scouts dive deep into specialized topics.</p>
<h3>Badges Earned</h3>
<ul>
<li><strong>Environmental Science (4):</strong> Scouts conducted water quality testing in the camp creek and identified native plant species</li>
<li><strong>Citizenship in the Community (3):</strong> Included a visit to the Black Mountain Town Council</li>
<li><strong>Personal Fitness (2):</strong> Started their 12-week fitness plans</li>
<li><strong>First Aid (2):</strong> Intensive hands-on scenarios including mock accident response</li>
<li><strong>Woodcarving (2):</strong> Each scout carved a neckerchief slide</li>
<li><strong>Astronomy (1):</strong> Clear skies allowed for excellent stargazing Saturday night</li>
<li><strong>Geocaching (1):</strong> New badge that combines technology and outdoor skills</li>
</ul>
<p>Special thanks to our merit badge counselors, especially Dr. Sarah Whitfield for Environmental Science and retired Captain Jim Morrison for First Aid. These volunteers give their time freely to invest in our scouts, and the quality of instruction showed.</p>
<p>Our next Merit Badge Weekend is scheduled for October. Watch this space for details!</p>`,
      excerpt:
        "Scouts earn 15 merit badges across eight subjects at the annual Merit Badge Weekend at Camp Grier.",
      category: "BLOG" as const,
      published: true,
      featuredImage: "https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?w=800&h=400&fit=crop",
    },
    {
      title: "Black Mountain Christmas Parade — Troop 42 Represents!",
      slug: "christmas-parade-black-mountain-2025",
      content: `<h2>Marching with Pride Through Downtown</h2>
<p>Troop 42 turned out in force for the annual Black Mountain Christmas Parade, with 28 scouts marching in full Class A uniform behind our troop flag. The scouts carried the American flag and led the Pledge of Allegiance at the parade's opening ceremony in front of Town Hall.</p>
<p>Our float, decorated by the Eagle and Bear patrols, featured a camp scene complete with a real canvas tent, a mock campfire with LED flames, and a banner reading "Adventure Awaits — Join Troop 42!" We received compliments all along the route, and several families stopped by our booth afterward to inquire about joining.</p>
<p>After the parade, scouts helped with cleanup along the parade route — picking up trash, stacking barricades, and helping the town crew break down the staging area. It wasn't part of the plan, but our scouts saw a need and stepped up. That is Scouting in action.</p>
<p>A big thanks to the Troop 42 Parents Committee for organizing hot chocolate and snacks, and to Mr. Chen for towing the float with his truck. Community events like this remind our scouts — and our neighbors — what Troop 42 is all about.</p>`,
      excerpt:
        "Twenty-eight scouts march in the Black Mountain Christmas Parade, lead the Pledge of Allegiance, and help with post-parade cleanup.",
      category: "BLOG" as const,
      published: true,
      featuredImage: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&h=400&fit=crop",
    },
    {
      title: "New Meeting Location Confirmed for Spring",
      slug: "spring-meeting-location-2026",
      content: `<h2>Same Great Meetings, Familiar Location</h2>
<p>We are pleased to confirm that Black Mountain Presbyterian Church will continue hosting our Tuesday evening meetings through the spring program year. The church has been incredibly supportive of our troop, and we are grateful for their generosity in providing the fellowship hall and outdoor areas for our activities.</p>
<h3>Meeting Schedule</h3>
<ul>
<li><strong>When:</strong> Every Tuesday, 7:00 PM – 8:30 PM</li>
<li><strong>Where:</strong> Fellowship Hall, Black Mountain Presbyterian Church, 117 Montreat Road</li>
<li><strong>Parking:</strong> Use the main lot off Montreat Road; overflow parking available behind the education building</li>
</ul>
<h3>What to Bring</h3>
<ul>
<li>Scout handbook</li>
<li>Class A uniform</li>
<li>Any merit badge materials you are working on</li>
<li>A positive attitude and willingness to learn!</li>
</ul>
<p>New scouts and families are welcome to visit any Tuesday meeting. No commitment required — just come see what we are about. Contact Scoutmaster Johnson through our website contact form if you have questions.</p>`,
      excerpt:
        "Black Mountain Presbyterian Church confirmed as our Tuesday meeting location. New scouts welcome — come visit any Tuesday at 7 PM.",
      category: "ANNOUNCEMENT" as const,
      published: true,
      featuredImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop",
    },
  ];

  for (const post of newPosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        authorId: admin.id,
      },
    });
  }
  console.log(`Created ${newPosts.length} new blog posts with images`);

  console.log("Extra seed complete!");
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
