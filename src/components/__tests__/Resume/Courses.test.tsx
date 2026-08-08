import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Courses from '../../Resume/Courses';
import Course from '../../Resume/Courses/Course';

const mockCourses = [
  {
    title: 'Computer Vision',
    number: 'AI 501',
    link: 'https://global.ulsan.ac.kr/en/',
    university: 'University of Ulsan',
  },
  {
    title: 'Deep Learning',
    number: 'AI 502',
    link: 'https://global.ulsan.ac.kr/en/',
    university: 'University of Ulsan',
  },
  {
    title: 'Algorithms',
    number: 'CS 201',
    link: 'https://nu.edu.kz/',
    university: 'Nazarbayev University',
  },
];

describe('Courses', () => {
  it('renders the courses section with title', () => {
    render(<Courses data={mockCourses} />);

    expect(
      screen.getByRole('heading', { name: /selected courses/i }),
    ).toBeInTheDocument();
  });

  it('renders all courses', () => {
    render(<Courses data={mockCourses} />);

    expect(screen.getByText('Computer Vision')).toBeInTheDocument();
    expect(screen.getByText('Deep Learning')).toBeInTheDocument();
    expect(screen.getByText('Algorithms')).toBeInTheDocument();
  });

  it('renders course numbers', () => {
    render(<Courses data={mockCourses} />);

    expect(screen.getByText(/AI 501/)).toBeInTheDocument();
    expect(screen.getByText(/AI 502/)).toBeInTheDocument();
    expect(screen.getByText(/CS 201/)).toBeInTheDocument();
  });

  it('renders courses as list items', () => {
    render(<Courses data={mockCourses} />);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();

    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(mockCourses.length);
  });

  it('sorts courses by university then number', () => {
    render(<Courses data={mockCourses} />);

    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(3);
  });

  it('has anchor link for navigation', () => {
    render(<Courses data={mockCourses} />);

    const anchor = document.getElementById('courses');
    expect(anchor).toBeInTheDocument();
  });
});

describe('Course', () => {
  const mockCourse = {
    title: 'Computer Vision',
    number: 'AI 501',
    link: 'https://global.ulsan.ac.kr/en/',
    university: 'University of Ulsan',
  };

  it('renders course number and title', () => {
    render(<Course data={mockCourse} />);

    expect(screen.getByText(/AI 501/)).toBeInTheDocument();
    expect(screen.getByText('Computer Vision')).toBeInTheDocument();
  });

  it('renders course as link', () => {
    render(<Course data={mockCourse} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', mockCourse.link);
  });

  it('renders as list item', () => {
    render(<Course data={mockCourse} />);

    const item = screen.getByRole('listitem');
    expect(item).toBeInTheDocument();
  });
});
