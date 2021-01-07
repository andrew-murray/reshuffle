import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders menu correctly', () => {
  render(<App />);
  const menuElement = screen.getByLabelText("menu");
  expect(menuElement).toBeInTheDocument();

  expect( screen.getByLabelText("Create Room") ).toBeInTheDocument();
  expect( screen.getByLabelText("Join Room") ).toBeInTheDocument();
  expect( screen.getByLabelText("Practice") ).toBeInTheDocument();
  expect( screen.getByLabelText("Settings") ).toBeInTheDocument();
});
