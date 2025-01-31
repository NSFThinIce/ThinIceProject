---
title: Team
nav:
  order: 2
  tooltip: About our team
---

# {% include icon.html icon="fa-solid fa-users" %}Team

{%
  include figure.html
  image="images/figures/proposal-map.jpg"
  caption="The locations of each principal investigator's research centers"
%}

{% include section.html background="images/background.jpg" dark=true %}

<p style="display: flex;justify-content: center; font-weight: bold; font-size: 1.5rem">
  Principal Investigators
</p>

{%
  include section.html
  background="images/more-backgrounds/background-1.jpg"
  size=wide
%}
{% include list.html data="members" component="portrait" filter="name == 'Dr. Rebecca North'" %} <!-- Have Rebecca North be first -->

{% include list.html data="members" component="portrait" filter="role == 'principal-investigator' && name != 'Dr. Rebecca North'" %} <!-- Put PI's Next -->

{% include section.html background="images/background.jpg" dark=true %}

<p style="display: flex;justify-content: center; font-weight: bold; font-size: 1.5rem">
  Undergraduates, Graduates, Post-Graduates, Lab Managers, Other Collaborators
</p>

{%
  include section.html
  background="images/more-backgrounds/background-2.jpg"
  size=wide
%}

{% include list.html data="members" component="portrait" filter="role != 'principal-investigator'" %} <!-- Then, everyone else -->