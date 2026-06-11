
const sliders = document.querySelectorAll('.slider');

sliders.forEach(container => {
	const viewport = container.querySelector('.slider__viewport');
	const prevBtn = container.querySelector('.prev-button');
	const nextBtn = container.querySelector('.next-button');

	// Function to check scroll position and disable/enable buttons
	function updateButtons() {
		const scrollLeft = viewport.scrollLeft;

		// Check if we are at the very beginning (allowing a tiny 1px fraction buffer)
		prevBtn.disabled = scrollLeft <= 1;

		// Check if we are at the very end
		// (Max scroll equals the total scrollable width minus the visible width)
		const maxScroll = viewport.scrollWidth - viewport.clientWidth;
		nextBtn.disabled = scrollLeft >= maxScroll - 1;
	}

	// Click event for Next Button
	nextBtn.addEventListener('click', () => {
		const cardWidth = viewport.querySelector('.slider__slide').clientWidth + 24;
		viewport.scrollLeft += cardWidth;
	});

	// Click event for Previous Button
	prevBtn.addEventListener('click', () => {
		const cardWidth = viewport.querySelector('.slider__slide').clientWidth + 24;
		viewport.scrollLeft -= cardWidth;
	});

	// Listen for scroll events to dynamically update button status
	viewport.addEventListener('scroll', updateButtons);

	// Listen for window resizing to recalculate positions if layouts scale
	window.addEventListener('resize', updateButtons);

	// Run initially to ensure the 'Previous' button starts disabled
	updateButtons();
});
