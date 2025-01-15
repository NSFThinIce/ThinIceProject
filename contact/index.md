---
title: Contact
nav:
  order: 3
  tooltip: Email, address, and location
---

# {% include icon.html icon="fa-regular fa-envelope" %}Website Contacts

For issues, feedback, etc contact jamiesoc2@newpaltz.edu (Christopher) or richardsond@newpaltz.edu (Dr. Richardson)

{%
  include button.html
  type="email"
  text="jamiesoc2@newpaltz.edu"
  link="jamiesoc2@newpaltz.edu"
%}

{%
  include button.html
  type="email"
  text="richardsond@newpaltz.edu"
  link="richardsond@newpaltz.edu"
%}

<!-- {%
  include button.html
  type="phone"
  text="(555) 867-5309"
  link="+1-555-867-5309"
%} -->
<!-- {%
  include button.html
  type="address"
  tooltip="Our location on Google Maps for easy navigation"
  link="https://www.google.com/maps"
%} -->

{% include section.html %}

{% capture col1 %}

{%
  include figure.html
  image="images/photo.jpg"
  caption="Lorem ipsum"
%}

{% endcapture %}

{% capture col2 %}

{%
  include figure.html
  image="images/photo.jpg"
  caption="Lorem ipsum"
%}

{% endcapture %}

{% include cols.html col1=col1 col2=col2 %}

{% include section.html dark=true %}

{% capture col1 %}
Lorem ipsum dolor sit amet  
consectetur adipiscing elit  
sed do eiusmod tempor
{% endcapture %}

{% capture col2 %}
Lorem ipsum dolor sit amet  
consectetur adipiscing elit  
sed do eiusmod tempor
{% endcapture %}

{% capture col3 %}
Lorem ipsum dolor sit amet  
consectetur adipiscing elit  
sed do eiusmod tempor
{% endcapture %}

{% include cols.html col1=col1 col2=col2 col3=col3 %}
