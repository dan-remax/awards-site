const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const sliders = document.querySelectorAll('.slider');

sliders.forEach(container => {
	const viewport = container.querySelector('.slider__viewport');
	const prevBtn = container.querySelector('.prev-button');
	const nextBtn = container.querySelector('.next-button');

	function updateButtons() {
		const scrollLeft = viewport.scrollLeft;
		prevBtn.disabled = scrollLeft <= 1;
		const maxScroll = viewport.scrollWidth - viewport.clientWidth;
		nextBtn.disabled = scrollLeft >= maxScroll - 1;
	}

	nextBtn.addEventListener('click', () => {
		const cardWidth = viewport.querySelector('.slider__slide').clientWidth + 24;
		viewport.scrollLeft += cardWidth;
	});

	prevBtn.addEventListener('click', () => {
		const cardWidth = viewport.querySelector('.slider__slide').clientWidth + 24;
		viewport.scrollLeft -= cardWidth;
	});

	viewport.addEventListener('scroll', updateButtons);
	window.addEventListener('resize', updateButtons);
	updateButtons();
});

function wrapDetailsPanels() {
	document.querySelectorAll('details').forEach(details => {
		if (details.querySelector(':scope > .info, :scope > .details-panel')) return;

		const panel = document.createElement('div');
		panel.className = 'details-panel';

		[...details.children]
			.filter(child => child.tagName !== 'SUMMARY')
			.forEach(child => panel.appendChild(child));

		details.appendChild(panel);
	});
}

function setupHeroEntrance() {
	const heroItems = document.querySelectorAll('#hero h1, #hero .subhead, #hero .container > div > p');

	heroItems.forEach((el, index) => {
		el.classList.add('hero-animate');
		el.style.setProperty('--hero-delay', `${0.1 + index * 0.15}s`);
	});
}

function setupScrollReveal() {
	const excluded = '.slider, .state-awards-grid, .ranking-awards, .event-grid, .event, .card, ul, ol';
	const selector = [
		'.container > h2',
		'.container > .subhead',
		'.container > p',
		'.container > details',
		'.container details',
		'.container > div > h2',
		'.container > div > .subhead',
		'.container > div > p',
		'.container > div > div > p',
		'.special-grid > div > h2',
		'.special-grid > div > p:first-of-type',
		'#footer .container > h2',
		'#footer .container > p:not(.fine-print)',
	].join(', ');

	const sections = document.querySelectorAll('main section:not(#hero), #footer');

	sections.forEach(section => {
		const targets = [...new Set(
			[...section.querySelectorAll(selector)].filter(el => !el.closest(excluded))
		)];

		targets.forEach((el, index) => {
			el.classList.add('reveal');
			el.style.setProperty('--reveal-delay', `${index * 100}ms`);
		});
	});

	const revealObserver = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			entry.target.classList.add('is-visible');
			revealObserver.unobserve(entry.target);
		});
	}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

	document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

function setupSliderStagger() {
	document.querySelectorAll('.slider').forEach(slider => {
		slider.querySelectorAll('.slider__slide').forEach((slide, index) => {
			slide.style.setProperty('--slide-index', index);
		});
	});

	const sliderObserver = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			entry.target.classList.add('is-visible');
			sliderObserver.unobserve(entry.target);
		});
	}, { threshold: 0.2 });

	document.querySelectorAll('.slider').forEach(slider => sliderObserver.observe(slider));
}

function setupParallaxHeroes() {
	document.querySelectorAll('.special-hero, .event-hero').forEach(img => {
		const wrap = document.createElement('div');
		wrap.className = 'parallax-hero-wrap';
		img.parentNode.insertBefore(wrap, img);
		wrap.appendChild(img);
		img.classList.add('parallax-hero');
	});

	const heroes = document.querySelectorAll('.parallax-hero');
	let ticking = false;

	function updateParallax() {
		heroes.forEach(img => {
			const rect = img.getBoundingClientRect();
			const progress = (rect.top + rect.height * 0.5 - window.innerHeight * 0.5) / window.innerHeight;
			img.style.transform = `translateY(${progress * 40}px) scale(1.08)`;
		});
		ticking = false;
	}

	window.addEventListener('scroll', () => {
		if (!ticking) {
			requestAnimationFrame(updateParallax);
			ticking = true;
		}
	}, { passive: true });

	updateParallax();
}

wrapDetailsPanels();

if (!prefersReducedMotion) {
	setupHeroEntrance();
	setupScrollReveal();
	setupSliderStagger();
	setupParallaxHeroes();
} else {
	document.querySelectorAll('.slider .slider__slide').forEach(slide => {
		slide.style.opacity = '1';
		slide.style.transform = 'none';
	});
}
