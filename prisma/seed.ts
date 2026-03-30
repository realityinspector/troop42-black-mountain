import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // -------------------------------------------------------------------------
  // Admin user
  // -------------------------------------------------------------------------
  const passwordHash = await bcrypt.hash("scoutmaster42", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@troop42.org" },
    update: {},
    create: {
      email: "admin@troop42.org",
      name: "Scoutmaster Johnson",
      role: "ADMIN",
      passwordHash,
    },
  });

  console.log(`Created admin user: ${admin.email}`);

  // -------------------------------------------------------------------------
  // Blog posts
  // -------------------------------------------------------------------------
  const posts = [
    {
      title: "Spring Camporee at Lake James State Park",
      slug: "spring-camporee-lake-james-2026",
      content: `<h2>A Weekend to Remember</h2>
<p>Last weekend, Troop 42 sent two full patrols to the Daniel Boone Council Spring Camporee at Lake James State Park, and what a weekend it was! The scouts competed in orienteering, fire building, first aid scenarios, and knot-tying relays against troops from across Western North Carolina.</p>
<p>Our Eagle Patrol took second place overall, with particular recognition in the pioneering competition where they constructed an impressive camp gateway using only lashings and natural timber.</p>
<h3>Highlights</h3>
<ul>
<li>Perfect weather all weekend with views of Linville Gorge from our campsite</li>
<li>Three scouts completed their Camping merit badge requirements</li>
<li>First-year scouts cooked their first full trail dinner without adult help</li>
<li>Saturday evening campfire featured skits from every troop in attendance</li>
</ul>
<p>A huge thanks to Assistant Scoutmaster Miller for organizing transportation and to all the parents who provided gear support. Our next big outing is the summer backpacking trip on the Art Loeb Trail -- start getting those boots broken in!</p>`,
      excerpt:
        "Troop 42 sends two patrols to the Spring Camporee at Lake James State Park with outstanding results in the pioneering competition.",
      category: "BLOG" as const,
      published: true,
    },
    {
      title: "Scoutmaster's Corner: Building Character One Campfire at a Time",
      slug: "scoutmasters-corner-building-character",
      content: `<p>Dear Troop 42 Families,</p>
<p>As we pass the halfway mark of our program year, I want to take a moment to reflect on what makes our troop special here in Black Mountain.</p>
<p>This year, I have watched scouts who could barely tie a square knot in September now confidently teaching younger scouts how to lash a tripod. I have seen shy first-year scouts find their voice leading a patrol meeting. And at every turn, I have seen the Scout Law lived out -- not just recited, but practiced.</p>
<p>When we do service projects at Montreat or help with the Black Mountain Christmas Parade, our scouts are not just checking boxes. They are learning that being "trustworthy, loyal, helpful" means something real in a community that knows them by name.</p>
<p>We have some exciting plans for the spring, including our annual trek on the Mountains-to-Sea Trail and the troop's first-ever canoe trip on the French Broad River. Please make sure your scouts are keeping up with their advancement work -- our next Board of Review is April 15th.</p>
<p>Yours in Scouting,<br/>Scoutmaster Johnson</p>`,
      excerpt:
        "Scoutmaster Johnson reflects on the troop's growth this year and previews exciting spring adventures including a French Broad River canoe trip.",
      category: "SCOUTMASTER_NOTE" as const,
      published: true,
    },
    {
      title: "Troop 42 Earns Three Eagle Scout Awards This Year",
      slug: "three-eagle-scouts-2026",
      content: `<h2>A Record Year for Eagles</h2>
<p>We are thrilled to announce that three Troop 42 scouts have earned the rank of Eagle Scout this program year, tying our troop record set back in 2018.</p>
<h3>Our Newest Eagles</h3>
<p><strong>Marcus Chen</strong> organized and led the construction of a new trail bridge at the Black Mountain Recreation Park for his Eagle project. The bridge serves hundreds of hikers and runners each week on the popular Flat Creek Trail.</p>
<p><strong>Will Patterson</strong> designed and built four Little Free Library boxes that were installed throughout downtown Black Mountain and the Montreat community. Each library box was hand-crafted from reclaimed lumber.</p>
<p><strong>James Whitfield</strong> coordinated a weekend-long effort to restore and repaint the historic picnic shelters at Lake Tomahawk, working with the town parks department and recruiting over 30 volunteers.</p>
<p>These young men represent the very best of what Scouting produces. Their Eagle projects collectively contributed over 450 hours of community service to Black Mountain and the surrounding area. Congratulations to Marcus, Will, and James -- and to their families and mentors who supported them on this journey.</p>`,
      excerpt:
        "Three Troop 42 scouts earn Eagle rank with community service projects benefiting Black Mountain parks, trails, and literacy programs.",
      category: "BLOG" as const,
      published: true,
    },
    {
      title: "Important: Summer Camp Registration Now Open",
      slug: "summer-camp-registration-2026",
      content: `<h2>Camp Daniel Boone -- July 12-18, 2026</h2>
<p>Registration for our week at Camp Daniel Boone is now open! This is the highlight of our scouting year, and we want every scout to have the opportunity to attend.</p>
<h3>Key Details</h3>
<ul>
<li><strong>Dates:</strong> July 12-18, 2026 (Sunday arrival, Saturday departure)</li>
<li><strong>Cost:</strong> $375 per scout (campership funds available -- ask Scoutmaster Johnson)</li>
<li><strong>Deposit:</strong> $100 due by April 30th to reserve your spot</li>
<li><strong>Merit Badges:</strong> Each scout can select up to 4 merit badges for the week</li>
</ul>
<h3>Popular Merit Badge Choices</h3>
<p>Swimming, Lifesaving, Rifle Shooting, Archery, Wilderness Survival, Cooking, and Environmental Science tend to fill up fast. Get your preferences in early!</p>
<p>Registration forms are available at Tuesday meetings or can be downloaded from this site. See Mr. Patterson (Troop Treasurer) with any payment questions.</p>`,
      excerpt:
        "Summer camp registration at Camp Daniel Boone is open. $100 deposit due April 30. Merit badge selections fill fast!",
      category: "ANNOUNCEMENT" as const,
      published: true,
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        authorId: admin.id,
      },
    });
  }

  console.log(`Created ${posts.length} posts`);

  // -------------------------------------------------------------------------
  // Events
  // -------------------------------------------------------------------------
  const events = [
    {
      title: "Weekly Troop Meeting",
      slug: "weekly-troop-meeting-april-2026",
      description:
        "Regular Tuesday troop meeting at Black Mountain Presbyterian Church fellowship hall. Scouts should arrive in full Class A uniform. This week: orienteering skills and compass work in preparation for the Spring Camporee. New scouts welcome!",
      location: "Black Mountain Presbyterian Church, 117 Montreat Rd, Black Mountain, NC",
      startDate: new Date("2026-04-07T19:00:00"),
      endDate: new Date("2026-04-07T20:30:00"),
      allDay: false,
      category: "MEETING" as const,
      published: true,
    },
    {
      title: "Pisgah National Forest Backpacking Trip",
      slug: "pisgah-backpacking-spring-2026",
      description: `<p>Join us for a two-night backpacking trip on the Art Loeb Trail in Pisgah National Forest! This is an intermediate-level trek covering approximately 15 miles over three days through some of the most beautiful terrain in Western North Carolina.</p>
<h3>Itinerary</h3>
<ul>
<li><strong>Friday:</strong> Depart church parking lot at 4:00 PM. Trailhead start and hike to first camp (~3 miles)</li>
<li><strong>Saturday:</strong> Full day of hiking through rhododendron tunnels and along ridgelines with panoramic views (~8 miles)</li>
<li><strong>Sunday:</strong> Pack out and return to Black Mountain by noon (~4 miles)</li>
</ul>
<p>Scouts must have completed Tenderfoot rank and have adequate backpacking gear. Shakedown hike will be held the Tuesday before departure. See the packing list resource on our website.</p>`,
      location: "Art Loeb Trail, Pisgah National Forest, NC",
      startDate: new Date("2026-04-24T16:00:00"),
      endDate: new Date("2026-04-26T12:00:00"),
      allDay: false,
      category: "CAMPOUT" as const,
      published: true,
    },
    {
      title: "Highway Cleanup Service Project",
      slug: "highway-cleanup-spring-2026",
      description:
        "Troop 42's quarterly Adopt-a-Highway cleanup along Route 9 between Black Mountain and Montreat. Scouts will earn service hours toward rank advancement. Trash bags, safety vests, and gloves will be provided. Wear closed-toe shoes and bring water. Meet at the church parking lot at 8:30 AM sharp. We will be done by noon.",
      location: "Route 9, Black Mountain to Montreat, NC",
      startDate: new Date("2026-05-02T08:30:00"),
      endDate: new Date("2026-05-02T12:00:00"),
      allDay: false,
      category: "SERVICE" as const,
      published: true,
    },
    {
      title: "Annual Christmas Tree Fundraiser",
      slug: "christmas-tree-sale-2026",
      description: `<p>Our biggest fundraiser of the year! Troop 42 will be selling premium Fraser Fir Christmas trees grown right here in the North Carolina mountains. All proceeds support troop activities, equipment, and camperships for the coming year.</p>
<h3>Details</h3>
<ul>
<li>Trees ranging from 5 to 10 feet, priced $45 to $95</li>
<li>Fresh-cut wreaths and garland also available</li>
<li>Scouts will help carry and tie trees to vehicles</li>
<li>Hot cocoa and cookies courtesy of the Troop 42 Parents Committee</li>
</ul>
<p>We need every scout to sign up for at least one 3-hour shift. Sign-up sheets will be available at the November meetings. Spread the word to friends, family, and neighbors!</p>`,
      location: "Black Mountain Town Square, Black Mountain, NC",
      startDate: new Date("2026-11-28T09:00:00"),
      endDate: new Date("2026-12-13T17:00:00"),
      allDay: true,
      category: "FUNDRAISER" as const,
      published: true,
    },
    {
      title: "Court of Honor Ceremony",
      slug: "court-of-honor-spring-2026",
      description:
        "Join us for our Spring Court of Honor, celebrating the achievements of Troop 42 scouts. Rank advancements, merit badges, and special awards will be presented. Families are encouraged to attend. Light refreshments will be served. Scouts should wear full Class A uniform.",
      location: "Black Mountain Presbyterian Church, 117 Montreat Rd, Black Mountain, NC",
      startDate: new Date("2026-05-19T18:30:00"),
      endDate: new Date("2026-05-19T20:00:00"),
      allDay: false,
      category: "SPECIAL" as const,
      published: true,
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      update: {},
      create: event,
    });
  }

  console.log(`Created ${events.length} events`);

  // -------------------------------------------------------------------------
  // Resources (packing lists)
  // -------------------------------------------------------------------------
  const resources = [
    {
      title: "Weekend Camping Packing List",
      slug: "weekend-camping-packing-list",
      content: `<h2>Weekend Camping Essentials</h2>
<p>This is the standard packing list for a typical Friday-Sunday troop campout in Western North Carolina. Adjust for weather conditions and specific trip requirements.</p>

<h3>Shelter & Sleeping</h3>
<ul>
<li>Tent (patrol tents provided, or bring your own)</li>
<li>Sleeping bag rated to 30F or lower (mountain nights get cold!)</li>
<li>Sleeping pad</li>
<li>Small pillow or stuff sack with clothes</li>
</ul>

<h3>Clothing</h3>
<ul>
<li>Class A uniform (for travel and flag ceremonies)</li>
<li>Activity/hiking clothes (2 sets)</li>
<li>Rain jacket or poncho</li>
<li>Warm fleece or jacket (even in summer at elevation)</li>
<li>Extra socks (wool or synthetic -- no cotton!)</li>
<li>Sturdy closed-toe shoes or hiking boots</li>
<li>Hat (sun protection)</li>
<li>Sleepwear</li>
</ul>

<h3>Personal Gear</h3>
<ul>
<li>Water bottle (at least 1 liter)</li>
<li>Headlamp or flashlight with extra batteries</li>
<li>Mess kit (plate, cup, utensils)</li>
<li>Pocket knife (with Totin' Chip card)</li>
<li>Sunscreen</li>
<li>Insect repellent</li>
<li>Personal first aid kit</li>
<li>Toiletries and towel</li>
<li>Trash bag for dirty clothes</li>
</ul>

<h3>Optional but Recommended</h3>
<ul>
<li>Camp chair</li>
<li>Scout handbook and advancement materials</li>
<li>Notebook and pen</li>
<li>Cards or camp games</li>
</ul>

<p><strong>Remember:</strong> Pack it in, pack it out. Leave No Trace!</p>`,
      category: "PACKING_LIST" as const,
      sortOrder: 1,
      published: true,
    },
    {
      title: "Backpacking Trip Gear List",
      slug: "backpacking-gear-list",
      content: `<h2>Backpacking Gear Checklist</h2>
<p>For multi-day backpacking trips on trails like the Art Loeb, Mountains-to-Sea, or Appalachian Trail sections near Black Mountain. Every ounce counts -- pack light!</p>

<h3>The Big Three</h3>
<ul>
<li>Backpack (50-65 liter, properly fitted)</li>
<li>Sleeping bag (rated 20-30F, compressible)</li>
<li>Shelter (patrol lightweight tent or hammock system)</li>
</ul>

<h3>Sleeping</h3>
<ul>
<li>Sleeping pad (inflatable or foam)</li>
<li>Pack liner or waterproof stuff sack for sleeping bag</li>
</ul>

<h3>Clothing (layering system)</h3>
<ul>
<li>Moisture-wicking base layer top and bottom</li>
<li>Insulating layer (fleece or puffy jacket)</li>
<li>Rain shell (jacket and pants)</li>
<li>Hiking pants and shorts</li>
<li>3 pairs wool/synthetic socks</li>
<li>Broken-in hiking boots with ankle support</li>
<li>Camp shoes (lightweight sandals)</li>
<li>Warm hat and sun hat</li>
<li>Gloves (spring/fall trips)</li>
</ul>

<h3>Kitchen</h3>
<ul>
<li>Lightweight cook pot and lid</li>
<li>Spork or utensil set</li>
<li>Water bottles/hydration bladder (2+ liters capacity)</li>
<li>Water filter or purification tablets</li>
<li>Bear bag/canister and 50ft paracord</li>
</ul>

<h3>Navigation & Safety</h3>
<ul>
<li>Map and compass (do not rely solely on phone)</li>
<li>Headlamp with extra batteries</li>
<li>Whistle</li>
<li>First aid kit</li>
<li>Fire starting kit (matches + lighter in waterproof bag)</li>
<li>Emergency shelter/space blanket</li>
</ul>

<h3>Target Pack Weight</h3>
<p>Base weight (everything except food and water) should be under 20 lbs for scouts. We will do a shakedown at the meeting before each trip to help everyone lighten their load.</p>`,
      category: "PACKING_LIST" as const,
      sortOrder: 2,
      published: true,
    },
    {
      title: "New Scout Gear Guide",
      slug: "new-scout-gear-guide",
      content: `<h2>Getting Started: Gear for New Scouts</h2>
<p>Welcome to Troop 42! You do not need to buy everything at once. Here is a prioritized guide to building your gear collection over your first year. The troop has loaner gear available -- just ask!</p>

<h3>Before Your First Campout (Essentials)</h3>
<ul>
<li><strong>Scout Uniform (Class A):</strong> Shirt, pants, belt, and socks from the Scout Shop in Asheville or online</li>
<li><strong>Sleeping Bag:</strong> Synthetic, rated to 30F. Budget option: Coleman or Teton Sports ($40-60)</li>
<li><strong>Water Bottle:</strong> 1 liter Nalgene or similar ($10-15)</li>
<li><strong>Headlamp:</strong> Any basic LED headlamp ($10-20)</li>
<li><strong>Rain Jacket:</strong> Any waterproof jacket you already own works fine</li>
</ul>

<h3>Within the First Few Months</h3>
<ul>
<li><strong>Mess Kit:</strong> Basic plate, bowl, cup, and utensils. GSI makes affordable sets ($15-25)</li>
<li><strong>Pocket Knife:</strong> After earning your Totin' Chip. Swiss Army Spartan is a great first knife ($25)</li>
<li><strong>Sleeping Pad:</strong> Foam pad to start, upgrade to inflatable later ($15-40)</li>
<li><strong>Day Pack:</strong> For day hikes and carrying gear at camp ($20-40)</li>
</ul>

<h3>As You Progress</h3>
<ul>
<li><strong>Hiking Boots:</strong> Properly fitted with ankle support. Visit Diamond Brand Outdoors in Asheville for expert fitting</li>
<li><strong>Backpack:</strong> When ready for backpacking trips (50-65L). Also worth getting fitted at Diamond Brand</li>
<li><strong>Compass:</strong> Suunto A-10 or similar baseplate compass for orienteering merit badge ($15-25)</li>
</ul>

<h3>Where to Shop</h3>
<ul>
<li><strong>Scout Shop:</strong> Asheville Scout Shop, 1 BSA Way, Asheville (uniforms and badges)</li>
<li><strong>Diamond Brand Outdoors:</strong> Great local shop in Asheville with scout-friendly staff</li>
<li><strong>REI Asheville:</strong> Good selection, member dividends help offset costs</li>
<li><strong>Online:</strong> Amazon, REI.com, Campmor -- compare prices</li>
</ul>

<p><strong>Pro tip:</strong> Check with other troop families before buying. Many families have outgrown gear they are happy to pass along. We also hold a gear swap at the start of each program year.</p>`,
      category: "GEAR_GUIDE" as const,
      sortOrder: 3,
      published: true,
    },
  ];

  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { slug: resource.slug },
      update: {},
      create: resource,
    });
  }

  console.log(`Created ${resources.length} resources`);

  // -------------------------------------------------------------------------
  // Notification
  // -------------------------------------------------------------------------
  await prisma.notification.create({
    data: {
      title: "Summer Camp Registration Open",
      message:
        "Registration for Camp Daniel Boone (July 12-18) is now open! $100 deposit due by April 30. See the announcement post for details.",
      type: "INFO",
      active: true,
      expiresAt: new Date("2026-04-30T23:59:59"),
    },
  });

  console.log("Created 1 notification");

  console.log("Seed complete!");
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
