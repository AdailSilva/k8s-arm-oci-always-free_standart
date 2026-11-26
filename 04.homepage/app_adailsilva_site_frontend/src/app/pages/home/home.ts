import { Component } from '@angular/core';
import { HomeHero } from './hero';
import { HomeNumbers } from './numbers';
import { HomeSolutions } from './solutions';
import { HomeProjects } from './projects';
import { HomeIot } from './iot';
import { HomeProcess } from './process';
import { HomeTechnology } from './technology';
import { HomeFaq } from './faq';
import { HomeContact } from './contact';

@Component({
    selector: 'home-page',
    standalone: true,
    imports: [HomeHero, HomeNumbers, HomeSolutions, HomeProjects, HomeIot, HomeProcess, HomeTechnology, HomeFaq, HomeContact],
    template: `
        <home-hero />
        <home-numbers />
        <home-solutions />
        <home-projects />
        <home-iot />
        <home-process />
        <home-technology />
        <home-faq />
        <home-contact />
    `
})
export class Home {}
